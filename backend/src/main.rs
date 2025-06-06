mod config;
mod controller;
mod doc;
mod error;
mod middleware;
mod state;
mod util;

use std::net::SocketAddr;

use axum::Router;
#[cfg(test)]
use axum_test::TestServer;
use config::server::ServerConfig;
use state::ApiState;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;
use tracing::level_filters::LevelFilter;
use tracing_subscriber::{
    EnvFilter, fmt::time::ChronoLocal, layer::SubscriberExt, util::SubscriberInitExt,
};

async fn build_app(config: &ServerConfig) -> Router {
    let state = ApiState::new(config).await;

    Router::new()
        .merge(controller::build(state.clone()))
        .merge(doc::build())
        .layer(TraceLayer::new_for_http())
        .layer(middleware::cors())
        .layer(middleware::session())
        .with_state(state)
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer()
                .pretty()
                .with_timer(ChronoLocal::rfc_3339()),
        )
        .with(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::DEBUG.into())
                .from_env_lossy(),
        )
        .init();

    let config = ServerConfig::default();

    let app = build_app(&config).await;

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), config.port)).await?;

    tracing::info!("Listening on port {}", config.port);

    axum::serve(listener, app)
        .await
        .map_err(anyhow::Error::from)
}

#[cfg(test)]
async fn build_test_server() -> TestServer {
    let config = ServerConfig::default();

    let app = build_app(&config).await;

    TestServer::builder()
        .save_cookies()
        .expect_success_by_default()
        .mock_transport()
        .build(app)
        .unwrap()
}
