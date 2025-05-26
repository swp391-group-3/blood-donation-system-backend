use rand::distr::{Alphanumeric, SampleString};

const BCRYPT_LENGTH: usize = 72;

pub async fn random_password() -> String {
    Alphanumeric.sample_string(&mut rand::rng(), BCRYPT_LENGTH)
}
