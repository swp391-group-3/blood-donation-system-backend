use config::{Config, Environment};
use serde::Deserialize;

const fn default_port() -> u16 {
    3000
}

#[derive(Deserialize)]
pub struct ServerConfig {
    pub database_url: String,

    #[serde(default = "default_port")]
    pub port: u16,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Config::builder()
            .add_source(Environment::default().try_parsing(true))
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }
}
