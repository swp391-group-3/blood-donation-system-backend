use std::net::SocketAddr;

use anyhow::Result;
use axum::Router;
#[cfg(test)]
use axum_test::TestServer;
use layer::cors_layer;
use state::ApiState;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::config::CONFIG;

mod controller;
mod doc;
mod layer;
mod state;

async fn build_app() -> Router {
    let state = ApiState::new().await;

    Router::new()
        .merge(controller::build())
        .merge(doc::build())
        .layer(TraceLayer::new_for_http())
        .layer(cors_layer())
        .with_state(state)
}

pub async fn run() -> Result<()> {
    let app = build_app().await;

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port)).await?;

    tracing::info!("Listening on port {}", CONFIG.port);

    axum::serve(listener, app)
        .await
        .map_err(anyhow::Error::from)
}

#[cfg(test)]
async fn build_test_server() -> TestServer {
    let app = build_app().await;

    TestServer::builder()
        .save_cookies()
        .expect_success_by_default()
        .mock_transport()
        .build(app)
        .unwrap()
}
