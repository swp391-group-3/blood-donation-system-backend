mod count_appointment;
mod create;
mod delete;
mod get_all;
mod get_booked;
mod update;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, Utc};
use ctypes::{BloodGroup, RequestPriority, Role};
use database::queries::blood_request::{GetAllBorrowed, GetBookedBorrowed};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{middleware, state::ApiState};

pub use count_appointment::*;
pub use create::*;
pub use delete::*;
pub use get_all::*;
pub use get_booked::*;
pub use update::*;

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get_all"), ty = GetAllBorrowed::<'_>))]
#[mapper(derive(from(custom = "from_get_booked"), ty = GetBookedBorrowed::<'_>))]
pub struct BloodRequest {
    pub blood_group: BloodGroup,
    pub priority: RequestPriority,
    pub title: String,
    pub max_people: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_route = Router::new()
        .route("/blood-request", routing::post(create))
        .route("/blood-request/{id}", routing::put(update))
        .route("/blood-request/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ));

    let member_route = Router::new()
        .route("/blood-request/get-booked", routing::get(get_booked))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ));

    Router::new()
        .merge(staff_route)
        .merge(member_route)
        .route("/blood-request", routing::get(get_all))
        .route(
            "/blood-request/{id}/count-appointment",
            routing::get(count_appointment),
        )
}
