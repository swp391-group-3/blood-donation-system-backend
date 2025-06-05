mod bcrypt;
mod cors;
mod jwt;
mod server;

use std::sync::LazyLock;

use bcrypt::BcryptConfig;
use cors::CorsConfig;
use jwt::JwtConfig;

pub use cors::*;
use server::ServerConfig;

pub struct Config {
    pub server: ServerConfig,
    pub cors: CorsConfig,
    pub jwt: JwtConfig,
    pub bcrypt: BcryptConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| Config {
    server: ServerConfig::new(),
    cors: CorsConfig::new(),
    jwt: JwtConfig::new(),
    bcrypt: BcryptConfig::new(),
});
