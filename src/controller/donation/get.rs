use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, donation::Donation},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation/{id}",
    operation_id = "donation::get",
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Donation>> {
    let donation = database::donation::get(id, &state.database_pool).await?;

    Ok(Json(donation))
}
