use axum::{Json, extract::State};
use database::queries;
use std::sync::Arc;

use crate::{error::Result, state::ApiState};

use super::Blog;

#[utoipa::path(
    get,
    tag = "Blog",
    path = "/blog",
    responses(
        (status = 200, description = "Get Blog Successfully", body = Blog)
    )
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Blog>>> {
    let database = state.database_pool.get().await?;

    let blogs = queries::blog::get_all()
        .bind(&database)
        .map(Blog::from_get_all)
        .all()
        .await?;

    Ok(Json(blogs))
}
