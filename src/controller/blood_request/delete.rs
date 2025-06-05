use std::sync::Arc;

use axum::extract::{Path, State};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

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
pub async fn delete(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::blood_request::delete()
        .bind(&database, &id)
        .await?;

    Ok(())
}
