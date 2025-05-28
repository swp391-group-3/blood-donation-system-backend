use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, account::*},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Staff",
    path = "/staff/list",
)]
pub async fn list(
    State(state): State<Arc<ApiState>>,
) -> Result<Json<Vec<AccountOverview>>> {
    let accounts = database::account::list_by_role(Role::Staff, &state.database_pool)
        .await?;

    Ok(Json(accounts))
}