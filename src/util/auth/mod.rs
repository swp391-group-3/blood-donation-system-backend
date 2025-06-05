pub mod oidc;

use std::sync::{Arc, LazyLock};

use axum::{RequestPartsExt, extract::FromRequestParts, http::request::Parts};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, encode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{config::CONFIG, error::AuthError, state::ApiState};

pub static ENCODING_KEY: LazyLock<EncodingKey> =
    LazyLock::new(|| EncodingKey::from_secret(CONFIG.jwt.secret.as_bytes()));
pub static DECODING_KEY: LazyLock<DecodingKey> =
    LazyLock::new(|| DecodingKey::from_secret(CONFIG.jwt.secret.as_bytes()));

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}

pub fn generate_token(id: Uuid) -> jsonwebtoken::errors::Result<String> {
    let now = Local::now().timestamp() as u64;

    encode(
        &Header::default(),
        &Claims {
            sub: id,
            exp: now + CONFIG.jwt.expired_in,
        },
        &ENCODING_KEY,
    )
}

impl FromRequestParts<Arc<ApiState>> for Claims {
    type Rejection = crate::error::Error;

    async fn from_request_parts(
        parts: &mut Parts,
        _: &Arc<ApiState>,
    ) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await?;

        let token = bearer.token();
        let token = jsonwebtoken::decode::<Claims>(token, &DECODING_KEY, &Validation::default())
            .map_err(|error| {
                tracing::error!(error = ?error);
                AuthError::InvalidAuthToken
            })?;

        Ok(token.claims)
    }
}
