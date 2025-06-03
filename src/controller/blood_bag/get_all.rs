use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, blood_bag::BloodBag},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag",
    operation_id = "blood_bag::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<BloodBag>>> {
    let blood_bags = database::blood_bag::list(&state.database_pool).await?;

    Ok(Json(blood_bags))
}
