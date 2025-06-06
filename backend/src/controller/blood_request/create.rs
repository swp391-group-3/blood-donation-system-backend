use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::{DateTime, Utc};
use ctypes::{BloodGroup, RequestPriority};
use database::{
    client::Params,
    queries::{self, blood_request::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blood_request::create::Request)]
#[mapper(
    into(custom = "with_staff_id"),
    ty = CreateParams::<String>,
    add(field = staff_id, ty = Uuid),
)]
pub struct Request {
    pub blood_group: BloodGroup,
    pub priority: RequestPriority,
    pub title: String,
    #[validate(range(min = 1))]
    pub max_people: u16,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::create",
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::blood_request::create()
        .params(&database, &request.with_staff_id(claims.sub))
        .one()
        .await?;

    Ok(Json(id))
}
