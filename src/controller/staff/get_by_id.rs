use std::sync::Arc;

use axum::{Json, extract::{Path, State}};
use uuid::Uuid;

use crate::{
    database::{self, account::*},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Staff",
    path = "/staff/get_by_id/{id}",
    operation_id = "staff::get_by_id",
    params(
        ("id" = Uuid, Path, description = "The UUID of the staff member")
    )
)]
pub async fn get_by_id(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<StaffDetail>>> {
    let account_details = database::account::get_staff_by_id(id, &state.database_pool)
        .await?;

    Ok(Json(account_details))
}