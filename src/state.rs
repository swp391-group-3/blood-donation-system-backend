use std::sync::Arc;

use database::{deadpool_postgres, tokio_postgres::NoTls};
use openidconnect::reqwest;

use crate::{config::CONFIG, util};

#[allow(unused)]
pub struct ApiState {
    pub database_pool: deadpool_postgres::Client,
    pub http_client: reqwest::Client,
    pub google_client: util::auth::oidc::Client,
    pub microsoft_client: util::auth::oidc::Client,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let mut database_config = deadpool_postgres::Config::new();
        database_config.url = Some(CONFIG.server.database_url.clone());
        let database_pool =
            database_config.create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)?;

        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap();

        let google_client = util::auth::oidc::new(
            CONFIG.google.client_id.clone(),
            CONFIG.google.client_secret.clone(),
            CONFIG.google.issuer_url.clone(),
            CONFIG.google.redirect_url.clone(),
            &http_client,
        )
        .await
        .unwrap();

        let microsoft_client = util::auth::oidc::new(
            CONFIG.microsoft.client_id.clone(),
            CONFIG.microsoft.client_secret.clone(),
            CONFIG.microsoft.issuer_url.clone(),
            CONFIG.microsoft.redirect_url.clone(),
            &http_client,
        )
        .await
        .unwrap();

        Arc::new(Self {
            database_pool,
            http_client,
            google_client,
            microsoft_client,
        })
    }
}
