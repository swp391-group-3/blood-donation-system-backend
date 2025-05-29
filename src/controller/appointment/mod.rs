mod delete;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
}
