use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::{
    database::{self, blog::*},
    state::ApiState,
};

#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog/{id}",
    params(
        ("id" = Uuid, description = "Blog Id")
    ),
    responses(
        (status = 200, description = "Get Blog Successfully", body = BlogResponse)
    )
)]
pub async fn get_by_id(
    Path(id): Path<Uuid>,
    State(state): State<Arc<ApiState>>,
) -> Result<Json<BlogResponse>, (StatusCode, String)> {
    match database::blog::get_by_id(id, &state.database_pool).await {
        Ok(Some(blog)) => Ok(Json(blog)),
        Ok(None) => Err((
            StatusCode::NOT_FOUND,
            format!("Blog with id {} not found", id),
        )),
        Err(database_err) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {}", database_err),
        )),
    }
}
