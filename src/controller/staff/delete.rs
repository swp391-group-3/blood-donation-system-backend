use std::sync::Arc;

use axum::extract::{Path, State};
use uuid::Uuid;

use crate::{
    database::{self},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    delete,
    tag = "Staff",
    path = "/staff/{id}",
    operation_id = "staff::delete",
    params(
        ("id" = Uuid, Path, description = "The UUID of the staff member")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(State(state): State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    database::account::delete(id, &state.database_pool).await?;

    Ok(())
}
