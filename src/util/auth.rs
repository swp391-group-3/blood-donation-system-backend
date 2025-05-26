use chrono::Local;
use rand::distr::{Alphanumeric, SampleString};
use serde::Serialize;
use uuid::Uuid;

const BCRYPT_LENGTH: usize = 72;

pub fn random_password() -> String {
    Alphanumeric.sample_string(&mut rand::rng(), BCRYPT_LENGTH)
}

#[derive(Serialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}

impl Claims {
    pub fn new(id: Uuid, expired_in: u64) -> Self {
        let now = Local::now().timestamp() as u64;

        Self {
            sub: id,
            exp: now + expired_in,
        }
    }
}
