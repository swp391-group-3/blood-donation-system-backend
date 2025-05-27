pub mod auth;
mod ping;
pub mod question;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
}
