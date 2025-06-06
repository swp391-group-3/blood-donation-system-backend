use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState};

use super::Donation;

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation",
    operation_id = "donation::get_all",
    responses(
        (status = Status::OK, body = Vec<Donation>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Donation>>> {
    let database = state.database_pool.get().await?;

    let donations = queries::donation::get_all()
        .bind(&database)
        .map(Donation::from_get_all)
        .all()
        .await?;

    Ok(Json(donations))
}
