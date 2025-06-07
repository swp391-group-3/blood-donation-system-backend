pub mod create;
pub mod delete;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use delete::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/comment/{id}", routing::post(create).delete(delete))
}
