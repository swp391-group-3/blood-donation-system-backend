pub mod bcrypt;
pub mod jwt;
pub mod oidc;

use std::sync::LazyLock;

use serde::Deserialize;

use crate::config::{bcrypt::BcryptConfig, jwt::JwtConfig, oidc::OpenIdConnectConfig};

#[derive(Debug, Deserialize)]
pub struct Config {
    pub database_url: String,
    pub port: u16,
    pub frontend_url: String,

    pub bcrypt: BcryptConfig,
    pub jwt: JwtConfig,
    pub open_id_connect: OpenIdConnectConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    ::config::Config::builder()
        .add_source(::config::File::with_name("config.dev").required(false))
        .add_source(::config::File::with_name("config.production").required(false))
        .add_source(::config::Environment::default().try_parsing(true))
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap()
});
