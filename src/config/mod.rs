use std::sync::LazyLock;

use serde::Deserialize;

const fn default_port() -> u16 {
    3000
}

fn default_cors_domain() -> String {
    "http://localhost:3000".to_string()
}

#[derive(Deserialize)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,

    #[serde(default = "default_cors_domain")]
    pub cors_domain: String,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    ::config::Config::builder()
        .add_source(::config::Environment::default().try_parsing(true))
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap()
});
