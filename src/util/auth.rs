use std::sync::LazyLock;

use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, encode};
use rand::distr::{Alphanumeric, SampleString};
use serde::Serialize;
use uuid::Uuid;

use crate::config::CONFIG;

pub static ENCODING_KEY: LazyLock<EncodingKey> =
    LazyLock::new(|| EncodingKey::from_secret(CONFIG.jwt.secret.as_bytes()));
pub static DECODING_KEY: LazyLock<DecodingKey> =
    LazyLock::new(|| DecodingKey::from_secret(CONFIG.jwt.secret.as_bytes()));

const BCRYPT_LENGTH: usize = 72;

pub fn random_password() -> String {
    Alphanumeric.sample_string(&mut rand::rng(), BCRYPT_LENGTH)
}

#[derive(Serialize)]
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
