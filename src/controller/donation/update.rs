use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema)]
#[schema(as = donation::update::Request)]
pub struct Request(UpdateParams);

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
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(Request(params)): Json<Request>,
) -> Result<()> {
    database::donation::update(id, &params, &state.database_pool).await?;

    Ok(())
}
