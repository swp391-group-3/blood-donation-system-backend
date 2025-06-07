use std::sync::Arc;

use crate::{error::Result, state::ApiState};
use axum::extract::{Path, State};
use database::queries;
use uuid::Uuid;

#[utoipa::path(
    delete,
    tag = "Donation",
    path = "/donation/{id}",
    operation_id = "donation::delete",
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::donation::delete().bind(&database, &id).await?;

    Ok(())
}
