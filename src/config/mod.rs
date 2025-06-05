mod bcrypt;
mod jwt;
mod server;

use std::sync::LazyLock;

use bcrypt::BcryptConfig;

use server::ServerConfig;

pub struct Config {
    pub server: ServerConfig,
    pub bcrypt: BcryptConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| Config {
    server: ServerConfig::new(),
    bcrypt: BcryptConfig::new(),
});
