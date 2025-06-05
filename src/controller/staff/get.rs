use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::Account;

#[utoipa::path(
    get,
    tag = "Staff",
    path = "/staff/{id}",
    operation_id = "staff::get",
    params(
        ("id" = Uuid, Path, description = "The UUID of the staff member")
    ),
    responses(
        (status = Status::OK, body = Option<Account>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<Account>>> {
    let database = state.database_pool.get().await?;

    let accounts = queries::account::get()
        .bind(&database, &id)
        .map(|raw| Account::from_get(raw))
        .opt()
        .await?;

    Ok(Json(accounts))
}
