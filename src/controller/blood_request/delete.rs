use std::sync::Arc;

use axum::extract::{Path, State};
use uuid::Uuid;

use crate::{database, error::Result, state::ApiState};

#[utoipa::path(
    delete,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::delete",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(State(state): State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    database::blood_request::delete(id, &state.database_pool).await?;

    Ok(())
}
