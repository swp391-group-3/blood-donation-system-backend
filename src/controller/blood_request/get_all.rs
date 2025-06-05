use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState};

use super::BloodRequest;

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::get_all"
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<BloodRequest>>> {
    let database = state.database_pool.get().await?;

    let requests = queries::blood_request::get_all()
        .bind(&database)
        .map(|raw| BloodRequest::from_get_all(raw))
        .all()
        .await?;

    Ok(Json(requests))
}
