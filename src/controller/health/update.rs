use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{self, health::UpdateParams},
    error::Result,
    state::ApiState,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = health::create::Request)]
pub struct Request(UpdateParams);

#[utoipa::path(
    patch,
    tag = "Health",
    path = "/health",
    operation_id = "health::update",
    params(
        ("id" = Uuid, Path, description = "Health id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
) ]
pub async fn update(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(Request(params)): Json<Request>,
) -> Result<()> {
    database::health::update(id, &params, &state.database_pool).await?;

    Ok(())
}
