use std::net::SocketAddr;

use anyhow::Result;
use axum::{
    Router,
    http::{
        HeaderName, HeaderValue, Method,
        header::{
            ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
            ACCESS_CONTROL_ALLOW_ORIGIN, AUTHORIZATION, CONTENT_TYPE, ORIGIN,
        },
    },
};
#[cfg(test)]
use axum_test::TestServer;
use state::ApiState;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

use crate::config::CONFIG;

mod controller;
mod doc;
mod state;

const ALLOW_HEADERS: [HeaderName; 7] = [
    ORIGIN,
    AUTHORIZATION,
    ACCESS_CONTROL_ALLOW_ORIGIN,
    CONTENT_TYPE,
    ACCEPT,
    ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_HEADERS,
];
const ALLOW_METHODS: [Method; 5] = [
    Method::GET,
    Method::POST,
    Method::DELETE,
    Method::PATCH,
    Method::PUT,
];

fn build_app() -> Router {
    let allow_origins = [CONFIG.cors_domain.parse::<HeaderValue>().unwrap()];
    let cors_layer = CorsLayer::new()
        .allow_origin(allow_origins)
        .allow_headers(ALLOW_HEADERS)
        .expose_headers(ALLOW_HEADERS)
        .allow_credentials(true)
        .allow_methods(ALLOW_METHODS);

    let state = ApiState::new();

    Router::new()
        .merge(controller::build())
        .merge(doc::build())
        .layer(cors_layer)
        .with_state(state)
}

pub async fn run() -> Result<()> {
    let app = build_app();

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port)).await?;

    axum::serve(listener, app)
        .await
        .map_err(anyhow::Error::from)
}

#[cfg(test)]
fn build_test_server() -> TestServer {
    let app = build_app();
    TestServer::builder()
        .save_cookies()
        .expect_success_by_default()
        .mock_transport()
        .build(app)
        .unwrap()
}
