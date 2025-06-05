use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::Donation;

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation/{id}",
    operation_id = "donation::get",
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    responses(
        (status = Status::OK, body = Donation)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<Donation>> {
    let database = state.database_pool.get().await?;

    let donation = queries::donation::get()
        .bind(&database, &id)
        .map(Donation::from_get)
        .one()
        .await?;

    Ok(Json(donation))
}
