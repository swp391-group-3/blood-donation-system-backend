use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, blood_request::BloodRequest},
    error::Result,
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/get-booked",
    operation_id = "blood_request::get_booked",
    security(("jwt_token" = []))
)]
pub async fn get_booked(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<BloodRequest>>> {
    let requests = database::blood_request::get_booked(claims.sub, &state.database_pool).await?;

    Ok(Json(requests))
}
