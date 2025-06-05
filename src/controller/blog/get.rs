use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::Blog;

#[utoipa::path(
    get,
    tag = "Blog",
    path = "/blog/{id}",
    params(
        ("id" = Uuid, description = "Blog Id")
    ),
    responses(
        (status = Status::OK, body = Option<Blog>)
    )
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<Option<Blog>>> {
    let database = state.database_pool.get().await?;

    let blog = queries::blog::get()
        .bind(&database, &id)
        .map(Blog::from_get)
        .opt()
        .await?;

    Ok(Json(blog))
}
