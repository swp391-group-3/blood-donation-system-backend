use std::sync::Arc;

use axum::extract::{Path, State};
use database::queries;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    delete,
    tag = "Question",
    path = "/question/{id}",
    operation_id = "question::delete",
    params(
        ("id" = i32, Path, description = "Question id")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(state: State<Arc<ApiState>>, Path(id): Path<i32>) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::question::delete().bind(&database, &id).await?;

    Ok(())
}
