use bcrypt::BcryptResult;

use crate::config::bcrypt::BcryptConfig;

#[derive(Default)]
pub struct BcryptService {
    pub config: BcryptConfig,
}

impl BcryptService {
    pub fn hash(&self, password: &str) -> BcryptResult<String> {
        bcrypt::hash_with_salt(password.as_bytes(), self.config.cost, self.config.salt)
            .map(|raw| raw.to_string())
    }

    pub fn verify(&self, password: &str, hashed_password: &str) -> BcryptResult<bool> {
        bcrypt::verify(password, hashed_password)
    }
}
