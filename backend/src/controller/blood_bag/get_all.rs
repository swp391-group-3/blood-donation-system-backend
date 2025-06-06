use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState};

use super::BloodBag;

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag",
    operation_id = "blood_bag::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<BloodBag>>> {
    let database = state.database_pool.get().await?;

    let blood_bags = queries::blood_bag::get_all()
        .bind(&database)
        .map(BloodBag::from_get_all)
        .all()
        .await?;

    Ok(Json(blood_bags))
}
