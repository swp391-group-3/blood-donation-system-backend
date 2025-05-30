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
    path = "/staff",
    operation_id = "staff::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(
    State(state): State<Arc<ApiState>>,
) -> Result<Json<Vec<StaffDetail>>> {
    let accounts = database::account::list_by_role(Role::Staff, &state.database_pool)
        .await?;

    Ok(Json(accounts))
}