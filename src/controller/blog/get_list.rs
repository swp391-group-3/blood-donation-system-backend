use axum::{Json, extract::State};
use std::sync::Arc;

use crate::{
    database::{self, blog::*},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog/getList",
    responses(
        (status = 200, description = "Get Blog Successfully", body = Blog)
    )
)]
pub async fn get_list(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<Blog>>> {
    let blogs: Vec<Blog> = database::blog::get_list(&state.database_pool).await?;

    Ok(Json(blogs))
}
