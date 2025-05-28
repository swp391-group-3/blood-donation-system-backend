use std::sync::Arc;

use axum::extract::{Path, State};

use crate::{database, error::Result, state::ApiState};

#[utoipa::path(
    delete,
    tag = "Question",
    path = "/question/{id}",
    params(
        ("id" = i32, Path, description = "Question id")
    ),
    security(("jwt_token" = []))
)]
#[axum::debug_handler]
pub async fn delete(State(state): State<Arc<ApiState>>, Path(id): Path<i32>) -> Result<()> {
    database::question::delete(id, &state.database_pool).await?;

    Ok(())
}
