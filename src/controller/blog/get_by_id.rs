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

pub async fn get_by_id(
    Path(id): Path<Uuid>,
    State(state): State<Arc<ApiState>>,
) -> Result<Json<BlogResponse>, (StatusCode, String)> {
    // cach 1
    // let blog_option = database::blog::get_blog_by_id(id, &state.database_pool)
    //     .await
    //     .map_err(|e| {
    //         (
    //             StatusCode::INTERNAL_SERVER_ERROR,
    //             format!("Database error: {}", e),
    //         )
    //     })?;

    // let blog = blog_option.ok_or_else(|| {
    //     (
    //         StatusCode::NOT_FOUND,
    //         format!("Blog with id {} not found", id),
    //     )
    // })?;

    // Ok(Json(blog))

    // cach 2
    match database::blog::get_blog_by_id(id, &state.database_pool).await {
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
