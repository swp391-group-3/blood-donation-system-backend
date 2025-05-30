mod create;
mod get_by_appointment_id;
mod get_by_member_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::{database::account::Role, middleware, state::ApiState};

pub use create::*;
pub use get_by_appointment_id::*;
pub use get_by_member_id::*;
pub use update::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}/health", routing::post(create))
        .route(
            "/appointment/{id}/health",
            routing::get(get_by_appointment_id),
        )
        .route("/health", routing::patch(update))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ))
        .route("/health", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ))
}
