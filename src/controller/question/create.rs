use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{database, error::Result, state::ApiState};

#[utoipa::path(
    post,
    tag = "Question",
    path = "/question",
    operation_id = "question::create",
    request_body = String,
    security(("jwt_token" = []))
)]
pub async fn create(State(state): State<Arc<ApiState>>, content: String) -> Result<Json<i32>> {
    let id = database::question::create(&content, &state.database_pool).await?;

    Ok(Json(id))
}
