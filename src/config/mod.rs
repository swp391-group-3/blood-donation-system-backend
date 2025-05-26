mod cors;
mod jwt;

use std::sync::LazyLock;

use cors::CorsConfig;
use jwt::JwtConfig;
use serde::Deserialize;

pub use cors::*;

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
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    ::config::Config::builder()
        .add_source(::config::Environment::default().try_parsing(true))
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap()
});
