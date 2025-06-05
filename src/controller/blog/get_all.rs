use axum::{Json, extract::State};
use database::queries;
use std::sync::Arc;

use crate::{error::Result, state::ApiState};

use super::Blog;

#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog",
    responses(
        (status = 200, description = "Get Blog Successfully", body = Blog)
    )
)]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<Blog>>> {
    let database = state.database_pool.get().await?;

    let blogs = queries::blog::get_all()
        .bind(&database)
        .map(|raw| Blog::from_get_all(raw))
        .all()
        .await?;

    Ok(Json(blogs))
}
