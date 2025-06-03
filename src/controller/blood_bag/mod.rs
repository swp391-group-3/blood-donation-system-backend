mod get_all;

use std::sync::Arc;

use axum::{Router, routing};

use crate::{database::account::Role, middleware, state::ApiState};

pub use get_all::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blood-bag", routing::get(get_all))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Staff),
        ))
}
