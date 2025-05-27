use std::sync::Arc;

use openidconnect::reqwest;
use sqlx::PgPool;

use crate::{config::CONFIG, util};

#[allow(unused)]
pub struct ApiState {
    pub database_pool: PgPool,
    pub http_client: reqwest::Client,
    pub google_client: util::auth::oidc::Client,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let database_pool = PgPool::connect(&CONFIG.server.database_url).await.unwrap();

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

        Arc::new(Self {
            database_pool,
            http_client,
            google_client,
        })
    }
}
