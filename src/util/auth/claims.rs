use std::sync::{Arc, LazyLock};

use axum::{RequestPartsExt, extract::FromRequestParts, http::request::Parts};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use chrono::Local;
use config::{Config, Environment};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use tower_sessions::cookie::SameSite;
use uuid::Uuid;

use crate::{config::CONFIG, error::AuthError, state::ApiState};

fn default_secret() -> String {
    "secret".to_string()
}

const fn default_expired_in() -> u64 {
    24 * 60 * 60
}

fn default_token_key() -> String {
    "token".to_string()
}

#[derive(Deserialize)]
pub struct JwtConfig {
    #[serde(default = "default_secret")]
    pub secret: String,

    #[serde(default = "default_expired_in")]
    pub expired_in: u64,

    #[serde(default = "default_token_key")]
    pub token_key: String,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}

pub struct JwtService {
    pub encoding_key: EncodingKey,
    pub decoding_key: DecodingKey,
    pub token_key: String,
}

impl Default for JwtService {
    fn default() -> Self {
        let config: JwtConfig = Config::builder()
            .add_source(Environment::default().prefix("JWT").try_parsing(true))
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap();
        Self {
            encoding_key: EncodingKey::from_secret(config.secret.as_bytes()),
            decoding_key: DecodingKey::from_secret(config.secret.as_bytes()),
            token_key: config.token_key,
        }
    }
}

impl JwtService {
    pub fn new_credential(&self, id: Uuid) -> jsonwebtoken::errors::Result<Cookie<'static>> {
        let now = Local::now().timestamp() as u64;

        let claims = Claims {
            sub: id,
            exp: now + .jwt.expired_in,
        };

        let token = jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key)?;

        let mut cookie = Cookie::new(self.token_key.clone(), token);
        // cookie.set_secure(true);
        cookie.set_same_site(SameSite::Lax);
        // cookie.set_http_only(true);
        cookie.set_path("/");

        Ok(cookie)
    }
}

impl FromRequestParts<Arc<ApiState>> for Claims {
    type Rejection = crate::error::Error;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<ApiState>,
    ) -> Result<Self, Self::Rejection> {
        let jar = parts.extract::<CookieJar>().await.unwrap();
        let token = jar
            .get(&state.jwt_service.token_key)
            .ok_or(AuthError::MissingAuthToken)?
            .value();

        let token = jsonwebtoken::decode::<Claims>(
            token,
            &state.jwt_service.decoding_key,
            &Validation::default(),
        )
        .map_err(|error| {
            tracing::error!(error = ?error);
            AuthError::InvalidAuthToken
        })?;

        Ok(token.claims)
    }
}
