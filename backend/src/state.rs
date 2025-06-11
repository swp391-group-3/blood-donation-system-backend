use std::{collections::HashMap, sync::Arc};

use database::{deadpool_postgres, tokio_postgres::NoTls};
use futures::{StreamExt, stream};

use crate::{
    config::{CONFIG, oidc::Provider},
    util::{jwt::JwtService, oidc::OpenIdConnectClient},
};

#[allow(unused)]
pub struct ApiState {
    pub database_pool: deadpool_postgres::Pool,
    pub oidc_clients: HashMap<Provider, OpenIdConnectClient>,
    pub jwt_service: JwtService,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let mut database_config = deadpool_postgres::Config::new();
        database_config.url = Some(CONFIG.database_url.clone());
        let database_pool = database_config
            .create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)
            .unwrap();

        let oidc_clients = stream::iter(CONFIG.open_id_connect.clients.iter())
            .then(|(&provider, config)| async move {
                (
                    provider,
                    OpenIdConnectClient::from_config(config.clone())
                        .await
                        .unwrap(),
                )
            })
            .collect()
            .await;

        Arc::new(Self {
            database_pool,
            oidc_clients,
            jwt_service: Default::default(),
        })
    }
}
