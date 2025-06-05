use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    post,
    tag = "Question",
    path = "/question",
    operation_id = "question::create",
    request_body = String,
    responses(
        (status = Status::OK, body = i32)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(state: State<Arc<ApiState>>, content: String) -> Result<Json<i32>> {
    let database = state.database_pool.get().await?;

    let id = queries::question::create()
        .bind(&database, &content)
        .one()
        .await?;

    Ok(Json(id))
}
