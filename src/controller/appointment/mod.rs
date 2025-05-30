mod delete;
mod get_answer;

use std::sync::Arc;

use axum::{Router, routing};

use crate::{database::account::Role, middleware, state::ApiState};

pub use delete::*;
pub use get_answer::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}/answer", routing::get(get_answer))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ))
        .route("/appointment/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ))
}
