use std::{env, sync::LazyLock};

use config::{Config, Environment};
use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;

pub static FRONTEND_REDIRECT_URL: LazyLock<String> =
    LazyLock::new(|| env::var("FRONTEND_REDIRECT_URL").unwrap());

#[derive(Deserialize)]
pub struct OpenIdConnectConfig {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
    pub redirect_url: RedirectUrl,
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
