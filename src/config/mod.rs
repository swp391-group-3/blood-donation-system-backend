mod bcrypt;
mod cors;
mod jwt;

use std::sync::LazyLock;

use bcrypt::BcryptConfig;
use cors::CorsConfig;
use jwt::JwtConfig;
use serde::Deserialize;

pub use cors::*;
pub use jwt::*;

const fn default_port() -> u16 {
    3000
}

#[derive(Deserialize)]
pub struct Config {
    pub database_url: String,

    #[serde(default = "default_port")]
    pub port: u16,

    pub cors: CorsConfig,

    pub jwt: JwtConfig,

    pub bcrypt: BcryptConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    ::config::Config::builder()
        .add_source(::config::Environment::default().try_parsing(true))
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap()
});
