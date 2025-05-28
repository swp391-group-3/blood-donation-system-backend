use anyhow::Result;
use axum::extract::State;
use std::sync::Arc;

use crate::{
    database::{self, blog::*},
    state::ApiState,
};

pub async fn get_list_of_blog(State(state): State<Arc<ApiState>>) -> Result<Vec<BlogResponse>> {
    let blogs: Vec<BlogResponse> = database::blog::get_list_of_blog(&state.database_pool).await?;

    Ok(blogs)
}
