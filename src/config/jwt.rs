use serde::Deserialize;

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
