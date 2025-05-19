mod ping;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/", routing::get(ping))
}
