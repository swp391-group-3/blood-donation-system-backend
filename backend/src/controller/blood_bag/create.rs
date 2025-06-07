use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use axum_valid::Valid;
use chrono::{DateTime, Utc};
use ctypes::BloodComponent;
use database::{
    client::Params,
    queries::{self, blood_bag::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blood_bag::create::Request)]
#[mapper(
    into(custom = "with_donation_id"),
    ty = CreateParams,
    add(field = donation_id, ty = Uuid)
)]
pub struct Request {
    pub component: BloodComponent,
    pub amount: i32,
    pub expired_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tags = ["Blood Bag", "Donation"],
    path = "/donation/{id}/blood-bag",
    operation_id = "blood-bag::create",
    request_body = Request,
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    Path(donation_id): Path<Uuid>,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::blood_bag::create()
        .params(&database, &request.with_donation_id(donation_id))
        .one()
        .await?;

    Ok(Json(id))
}
