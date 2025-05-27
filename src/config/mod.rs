mod bcrypt;
mod cors;
mod google;
mod jwt;
mod server;

use std::sync::LazyLock;

use bcrypt::BcryptConfig;
use cors::CorsConfig;
use google::GoogleConfig;
use jwt::JwtConfig;

pub use cors::*;
use server::ServerConfig;

pub struct Config {
    pub server: ServerConfig,
    pub cors: CorsConfig,
    pub jwt: JwtConfig,
    pub bcrypt: BcryptConfig,
    pub google: GoogleConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| Config {
    server: ServerConfig::new(),
    cors: CorsConfig::new(),
    jwt: JwtConfig::new(),
    bcrypt: BcryptConfig::new(),
    google: GoogleConfig::new(),
});
