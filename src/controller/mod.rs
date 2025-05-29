pub mod appointment;
pub mod auth;
pub mod staff;
pub mod blood_request;
pub mod question;
pub mod blog;
mod ping;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(blog::build())
}
