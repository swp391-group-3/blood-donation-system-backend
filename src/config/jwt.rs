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

#[derive(Deserialize)]
pub struct JwtConfig {
    #[serde(default = "default_secret")]
    pub secret: String,

    #[serde(default = "default_expired_in")]
    pub expired_in: u64,
}
