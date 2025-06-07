use std::sync::Arc;

use crate::{controller::blog::Blog, error::Result, state::ApiState};
use axum::{Json, extract::State};
use database::queries::{self};

pub async fn search_blog(
    state: State<Arc<ApiState>>,
    Json(content): Json<String>,
) -> Result<Json<Vec<Blog>>> {
    let database = state.database_pool.get().await?;

    let blogs = queries::blog::search_blog()
        .bind(&database, &content)
        .map(Blog::from_search_blog)
        .all()
        .await?;

    Ok(Json(blogs))
}
