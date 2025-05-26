mod register;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use register::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/auth/register", routing::post(register))
}
