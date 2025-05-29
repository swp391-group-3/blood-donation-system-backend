mod create;
mod get_by_appointment_id;
mod get_by_member_id;
mod update;

use std::sync::Arc;

use axum::{
    Router,
    extract::{Request, State},
    middleware::Next,
    routing,
};

use crate::{database::account::Role, middleware, state::ApiState, util::auth::Claims};

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
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Staff], claims, state, request, next)
            },
        ))
        .route("/health", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Member], claims, state, request, next)
            },
        ))
}
