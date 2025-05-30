use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, donation::Donation},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation",
    operation_id = "donation::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<Donation>>> {
    let donations = database::donation::get_all(&state.database_pool).await?;

    Ok(Json(donations))
}
