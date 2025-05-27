use serde::Deserialize;

fn default_issuer_url() -> String {
    "https://login.microsoftonline.com/f4d237b6-67c2-4335-905c-56dec4c015bc/v2.0".to_string()
}

fn default_redirect_url() -> String {
    "http://localhost:3000/auth/microsoft/authorized".to_string()
}

#[derive(Deserialize)]
pub struct MicrosoftConfig {
    pub client_id: String,

    pub client_secret: String,

    #[serde(default = "default_issuer_url")]
    pub issuer_url: String,

    #[serde(default = "default_redirect_url")]
    pub redirect_url: String,
}

impl MicrosoftConfig {
    pub fn new() -> Self {
        ::config::Config::builder()
            .add_source(
                ::config::Environment::default()
                    .prefix("MICROSOFT")
                    .try_parsing(true),
            )
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }
}
