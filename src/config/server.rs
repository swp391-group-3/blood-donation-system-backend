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

impl ServerConfig {
    pub fn new() -> Self {
        ::config::Config::builder()
            .add_source(::config::Environment::default().try_parsing(true))
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }
}
