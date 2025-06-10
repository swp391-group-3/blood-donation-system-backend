use std::collections::HashMap;

use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Debug, PartialEq, Eq, Hash, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum Provider {
    Google,
    Microsoft,
}

#[derive(Debug, Deserialize)]
pub struct ClientConfig {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
    pub redirect_url: RedirectUrl,
}

#[derive(Debug, Deserialize)]
pub struct OpenIdConnectConfig {
    pub clients: HashMap<Provider, ClientConfig>,
    pub frontend_redirect_url: String,
}
