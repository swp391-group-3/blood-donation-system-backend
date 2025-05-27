use std::sync::Arc;

use axum::Router;

use crate::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
}
