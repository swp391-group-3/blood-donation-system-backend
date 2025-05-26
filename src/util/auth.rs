use chrono::Local;
use jsonwebtoken::{Header, encode};
use rand::distr::{Alphanumeric, SampleString};
use serde::Serialize;
use uuid::Uuid;

use crate::config::{CONFIG, KEYS};

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
        &KEYS.encoding,
    )
}
