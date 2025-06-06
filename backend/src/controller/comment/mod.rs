pub mod create;

use std::sync::Arc;

use axum::{Router, routing::post};

use crate::state::ApiState;

pub use create::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/create", post(create))
}
