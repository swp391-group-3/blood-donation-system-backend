use std::net::SocketAddr;

use anyhow::Result;
use axum::Router;
use state::ApiState;
use tokio::net::TcpListener;

use crate::config::CONFIG;

mod controller;
mod state;

pub async fn run() -> Result<()> {
    let state = ApiState::new();

    let router: Router = Router::new().merge(controller::build()).with_state(state);

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port)).await?;

    axum::serve(listener, router)
        .await
        .map_err(anyhow::Error::from)
}
