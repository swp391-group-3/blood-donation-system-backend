use serde::Deserialize;

fn default_issuer_url() -> String {
    "https://accounts.google.com".to_string()
}

#[derive(Deserialize)]
pub struct GoogleConfig {
    pub client_id: String,

    pub client_secret: String,

    #[serde(default = "default_issuer_url")]
    pub issuer_url: String,
}

impl GoogleConfig {
    pub fn new() -> Self {
        ::config::Config::builder()
            .add_source(
                ::config::Environment::default()
                    .prefix("GOOGLE")
                    .try_parsing(true),
            )
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }
}
