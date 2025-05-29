use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, blood_request::BloodRequest},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::get_all"
)]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<BloodRequest>>> {
    let requests = database::blood_request::get_all(&state.database_pool).await?;

    Ok(Json(requests))
}
