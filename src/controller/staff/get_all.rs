use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState};

use super::Account;

#[utoipa::path(
    get,
    tag = "Staff",
    path = "/staff",
    operation_id = "staff::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Account>>> {
    let database = state.database_pool.get().await?;

    let accounts = queries::account::get_all()
        .bind(&database)
        .map(|raw| Account::from_get_all(raw))
        .all()
        .await?;

    Ok(Json(accounts))
}
