mod create;
mod delete;
mod get;
mod get_all;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, Utc};
use ctypes::{BloodComponent, Role};
use database::queries::blood_bag::{Get, GetAll};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get_all"), ty = GetAll))]
#[mapper(derive(from(custom = "from_get"), ty = Get))]
pub struct BloodBag {
    pub id: Uuid,
    pub donation_id: Uuid,
    pub component: BloodComponent,
    pub is_used: bool,
    pub amount: i32,
    pub expired_time: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blood-bag", routing::get(get_all))
        .route("/blood-bag/{id}", routing::get(get))
        .route("/donation/{id}/blood-bag", routing::post(create))
        .route("/blood-bag/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Staff),
        ))
}
