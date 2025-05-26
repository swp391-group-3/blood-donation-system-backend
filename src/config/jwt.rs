use std::sync::LazyLock;

use jsonwebtoken::{DecodingKey, EncodingKey};
use serde::Deserialize;

use super::CONFIG;

fn default_secret() -> String {
    "secret".to_string()
}

const fn default_expired_in() -> u64 {
    24 * 60 * 60
}

fn default_refresh_secret() -> String {
    "secret".to_string()
}

const fn default_secret_expired_in() -> u64 {
    7 * 24 * 60 * 60
}

#[derive(Deserialize)]
pub struct JwtConfig {
    #[serde(default = "default_secret")]
    secret: String,

    #[serde(default = "default_expired_in")]
    expired_in: u64,

    #[serde(default = "default_refresh_secret")]
    refresh_secret: String,

    #[serde(default = "default_secret_expired_in")]
    refresh_expired_in: u64,
}

struct Keys {
    encoding: EncodingKey,
    decoding: DecodingKey,
}

impl Keys {
    fn from_secret(secret: &str) -> Self {
        Keys {
            encoding: EncodingKey::from_secret(secret.as_bytes()),
            decoding: DecodingKey::from_secret(secret.as_bytes()),
        }
    }
}

pub static KEYS: LazyLock<Keys> = LazyLock::new(|| Keys::from_secret(&CONFIG.jwt.secret));
pub static REFRESH_KEYS: LazyLock<Keys> =
    LazyLock::new(|| Keys::from_secret(&CONFIG.jwt.refresh_secret));
