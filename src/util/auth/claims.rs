use std::sync::{Arc, LazyLock};

use axum::{RequestPartsExt, extract::FromRequestParts, http::request::Parts};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use tower_sessions::cookie::SameSite;
use uuid::Uuid;

use crate::{config::CONFIG, error::AuthError, state::ApiState};

pub static ENCODING_KEY: LazyLock<EncodingKey> =
    LazyLock::new(|| EncodingKey::from_secret(CONFIG.jwt.secret.as_bytes()));
pub static DECODING_KEY: LazyLock<DecodingKey> =
    LazyLock::new(|| DecodingKey::from_secret(CONFIG.jwt.secret.as_bytes()));

const TOKEN_KEY: &str = "token";

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}

impl Claims {
    pub fn new(id: Uuid) -> Self {
        let now = Local::now().timestamp() as u64;

        Self {
            sub: id,
            exp: now + CONFIG.jwt.expired_in,
        }
    }
}

impl TryFrom<Claims> for Cookie<'static> {
    type Error = jsonwebtoken::errors::Error;

    fn try_from(claims: Claims) -> Result<Self, Self::Error> {
        let token = jsonwebtoken::encode(&Header::default(), &claims, &ENCODING_KEY)?;

        let mut cookie = Cookie::new(TOKEN_KEY, token);
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
        _: &Arc<ApiState>,
    ) -> Result<Self, Self::Rejection> {
        let jar = parts.extract::<CookieJar>().await.unwrap();
        let token = jar
            .get(TOKEN_KEY)
            .ok_or(AuthError::MissingAuthToken)?
            .value();

        let token = jsonwebtoken::decode::<Claims>(token, &DECODING_KEY, &Validation::default())
            .map_err(|error| {
                tracing::error!(error = ?error);
                AuthError::InvalidAuthToken
            })?;

        Ok(token.claims)
    }
}
