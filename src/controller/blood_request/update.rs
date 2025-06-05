use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use ctypes::RequestPriority;
use database::{
    client::Params,
    queries::{self, blood_request::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper)]
#[mapper(
    into(custom = "with_id"),
    ty = UpdateParams::<String>,
    add(field = id, ty = Uuid)
)]
pub struct UpdateBloodRequest {
    pub priority: Option<RequestPriority>,
    pub title: Option<String>,
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
    request_body = UpdateBloodRequest,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateBloodRequest>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::blood_request::update()
        .params(&database, &request.with_id(id))
        .await?;

    Ok(())
}
