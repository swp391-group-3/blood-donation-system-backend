mod get_all;
mod get_by_id;

use std::sync::Arc;

use axum::{Router, routing};

use crate::{database::account::Role, middleware, state::ApiState};

pub use get_all::*;
pub use get_by_id::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blood-bag", routing::get(get_all))
        .route("/blood-bag/{id}", routing::get(get_by_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Staff),
        ))
}
