use config::{Config, Environment};
use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct OpenIdConnectConfig {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
    pub redirect_url: RedirectUrl,
    pub frontend_redirect_url: String,
}

impl OpenIdConnectConfig {
    pub fn new(provider: &str) -> Self {
        Config::builder()
            .add_source(Environment::default().prefix(provider).try_parsing(true))
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }
}
