use std::collections::HashMap;

use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct ClientConfig {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
}

#[derive(Debug, Deserialize)]
pub struct OpenIdConnectConfig {
    pub clients: HashMap<String, ClientConfig>,
    pub frontend_redirect_url: String,
    pub oauth2_redirect_url: RedirectUrl,
}
