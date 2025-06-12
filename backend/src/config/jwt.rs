use serde::Deserialize;

fn default_secret() -> String {
    "secret".to_string()
}

const fn default_expired_in() -> u64 {
    24 * 60 * 60
}

fn default_token_key() -> String {
    "token".to_string()
}

#[derive(Debug, Deserialize)]
pub struct JwtConfig {
    #[serde(default = "default_secret")]
    pub secret: String,

    #[serde(default = "default_expired_in")]
    pub expired_in: u64,

    #[serde(default = "default_token_key")]
    pub token_key: String,
}
