use std::sync::Arc;

use database::{deadpool_postgres, tokio_postgres::NoTls};

use crate::{
    config::{oidc::OpenIdConnectConfig, server::ServerConfig},
    util::{bcrypt::BcryptService, jwt::JwtService, oidc::OpenIdConnectClient},
};

#[allow(unused)]
pub struct ApiState {
    pub database_pool: deadpool_postgres::Pool,
    pub google_client: OpenIdConnectClient,
    pub microsoft_client: OpenIdConnectClient,
    pub jwt_service: JwtService,
    pub bcrypt_service: BcryptService,
}

impl ApiState {
    pub async fn new(config: &ServerConfig) -> Arc<Self> {
        let mut database_config = deadpool_postgres::Config::new();
        database_config.url = Some(config.database_url.clone());
        let database_pool = database_config
            .create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)
            .unwrap();

        let google_client = OpenIdConnectClient::from_config(OpenIdConnectConfig::new("google"))
            .await
            .unwrap();
        let microsoft_client =
            OpenIdConnectClient::from_config(OpenIdConnectConfig::new("microsoft"))
                .await
                .unwrap();

        Arc::new(Self {
            database_pool,
            google_client,
            microsoft_client,
            jwt_service: Default::default(),
            bcrypt_service: Default::default(),
        })
    }
}
