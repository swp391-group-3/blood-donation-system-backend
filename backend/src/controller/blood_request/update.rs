use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use axum_valid::Valid;
use ctypes::RequestPriority;
use database::{
    client::Params,
    queries::{self, blood_request::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blood_request::update::Request)]
#[mapper(
    into(custom = "with_id"),
    ty = UpdateParams::<String>,
    add(field = id, ty = Uuid)
)]
pub struct Request {
    pub priority: Option<RequestPriority>,
    #[validate(length(min = 1))]
    pub title: Option<String>,
    #[validate(range(min = 1))]
    pub max_people: Option<i32>,
}

#[utoipa::path(
    put,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::update",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::blood_request::update()
        .params(&database, &request.with_id(id))
        .await?;

    Ok(())
}
