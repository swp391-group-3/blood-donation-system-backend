use std::sync::Arc;

use database::{deadpool_postgres, tokio_postgres::NoTls};
use openidconnect::reqwest;

use crate::{config::CONFIG, util::auth::OpenIdConnectClient};

#[allow(unused)]
pub struct ApiState {
    pub database_pool: deadpool_postgres::Pool,
    pub google_client: OpenIdConnectClient,
    pub microsoft_client: OpenIdConnectClient,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let mut database_config = deadpool_postgres::Config::new();
        database_config.url = Some(CONFIG.server.database_url.clone());
        let database_pool = database_config
            .create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)
            .unwrap();

        let google_client = OpenIdConnectClient::new("google").await.unwrap();
        let microsoft_client = OpenIdConnectClient::new("microsoft").await.unwrap();

        Arc::new(Self {
            database_pool,
            google_client,
            microsoft_client,
        })
    }
}
