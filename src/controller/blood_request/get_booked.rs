use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState, util::auth::Claims};

use super::BloodRequest;

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/get-booked",
    operation_id = "blood_request::get_booked",
    security(("jwt_token" = []))
)]
pub async fn get_booked(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<BloodRequest>>> {
    let database = state.database_pool.get().await?;

    let requests = queries::blood_request::get_booked()
        .bind(&database, &claims.sub)
        .map(BloodRequest::from_get_booked)
        .all()
        .await?;

    Ok(Json(requests))
}
