mod count_appointment;
mod create;
mod create_appointment;
mod delete;
mod get_all;
mod get_booked;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::{database::account::Role, middleware, state::ApiState};

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
            middleware::authorize!(Role::Staff),
        ))
        .route(
            "/blood-request/{id}/create-appointment",
            routing::post(create_appointment),
        )
        .route("/blood-request/get-booked", routing::get(get_booked))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ))
        .route("/blood-request", routing::get(get_all))
        .route(
            "/blood-request/{id}/count-appointment",
            routing::get(count_appointment),
        )
}
