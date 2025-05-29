pub mod auth;
mod blood_request;
mod ping;
pub mod question;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(question::build(state.clone()))
        .merge(blood_request::build(state))
}
