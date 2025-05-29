use axum::{Json, extract::State, http::StatusCode};
use std::sync::Arc;

use crate::{
    database::{self, blog::*},
    state::ApiState,
};
#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog/getList",
    responses(
        (status = 200, description = "Get Blog Successfully", body = BlogResponse)
    )
)]
pub async fn get_list(
    State(state): State<Arc<ApiState>>,
) -> Result<Json<Vec<BlogResponse>>, (StatusCode, String)> {
    let blogs: Vec<BlogResponse> = database::blog::get_list(&state.database_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error:{}", e),
            )
        })?;

    Ok(Json(blogs))
}
