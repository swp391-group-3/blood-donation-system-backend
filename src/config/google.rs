use serde::Deserialize;

#[derive(Deserialize)]
pub struct GoogleConfig {
    pub client_id: String,
    pub client_secret: String,
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
