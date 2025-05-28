use std::sync::Arc;

use axum::extract::{Path, State};

use crate::{database, error::Result, state::ApiState};

#[utoipa::path(
    put,
    tag = "Question",
    path = "/question/{id}",
    params(
        ("id" = i32, Path, description = "Question id")
    ),
    request_body = String,
    security(("jwt_token" = []))
)]
#[axum::debug_handler]
pub async fn update(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<i32>,
    new_content: String,
) -> Result<()> {
    database::question::update(id, &new_content, &state.database_pool).await?;

    Ok(())
}
