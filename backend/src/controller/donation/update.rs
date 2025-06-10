use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use axum_valid::Valid;
use database::{
    client::Params,
    queries::{self, donation::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = donation::update::Request)]
#[mapper(
    into(custom = "with_id"),
    ty = UpdateParams,
    add(field = id, ty = Uuid)
)]
pub struct Request {
    pub r#type: Option<ctypes::DonationType>,
    #[validate(range(min = 1))]
    pub amount: Option<i32>,
}

#[utoipa::path(
    patch,
    tag = "Donation",
    path = "/donation/{id}",
    operation_id = "donation::update",
    params(
        ("id" = Uuid, Path, description = "Donation id")
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

    queries::donation::update()
        .params(&database, &request.with_id(id))
        .await?;

    Ok(())
}
