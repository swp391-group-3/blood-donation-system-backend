use std::sync::Arc;

use sqlx::PgPool;

use crate::config::CONFIG;

#[allow(unused)]
pub struct ApiState {
    pub database_pool: PgPool,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let database_pool = PgPool::connect(&CONFIG.server.database_url).await.unwrap();

        Arc::new(Self { database_pool })
    }
}
