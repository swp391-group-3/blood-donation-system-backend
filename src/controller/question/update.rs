use std::sync::Arc;

use axum::extract::{Path, State};
use database::queries;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    put,
    tag = "Question",
    path = "/question/{id}",
    operation_id = "question::update",
    params(
        ("id" = i32, Path, description = "Question id")
    ),
    request_body = String,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<i32>,
    new_content: String,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::question::update()
        .bind(&database, &new_content, &id)
        .await?;

    Ok(())
}
