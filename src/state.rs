use std::sync::Arc;

use openidconnect::reqwest;
use sqlx::PgPool;

use crate::config::CONFIG;

#[allow(unused)]
pub struct ApiState {
    pub database_pool: PgPool,
    pub http_client: reqwest::Client,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let database_pool = PgPool::connect(&CONFIG.server.database_url).await.unwrap();

        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap();

        Arc::new(Self {
            database_pool,
            http_client,
        })
    }
}
