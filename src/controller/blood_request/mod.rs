mod count_appointment;
mod create;
mod create_appointment;
mod delete;
mod get_all;
mod get_booked;
mod update;

use std::sync::Arc;

use axum::{
    Router,
    extract::{Request, State},
    middleware::Next,
    routing,
};

use crate::{database::account::Role, middleware, state::ApiState, util::auth::Claims};

pub use count_appointment::*;
pub use create::*;
pub use create_appointment::*;
pub use delete::*;
pub use get_all::*;
pub use get_booked::*;
pub use update::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blood-request", routing::post(create))
        .route("/blood-request/{id}", routing::put(update))
        .route("/blood-request/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Staff], claims, state, request, next)
            },
        ))
        .route(
            "/blood-request/{id}/create-appointment",
            routing::post(create_appointment),
        )
        .route("/blood-request/get-booked", routing::get(get_booked))
        .layer(axum::middleware::from_fn_with_state(
            state,
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Member], claims, state, request, next)
            },
        ))
        .route("/blood-request", routing::get(get_all))
        .route(
            "/blood-request/{id}/count-appointment",
            routing::get(count_appointment),
        )
}
