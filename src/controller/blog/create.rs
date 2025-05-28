use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
// use utoipa::{ schema, ToSchema};

use crate::{
    database::{self},
    error::{ Result},
    state::ApiState,
};

use uuid::Uuid;

#[derive(Deserialize)]
//#[schema(as = blog::create::Request)]
pub struct Request{
    pub account_id: Uuid,
    pub title: String,
    pub content: String,
}

pub async fn create_blog(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<String> {
    let id = database::blog::create_blog(
        &request.account_id,
        &request.title,
        &request.content,
        &state.database_pool
    )
    .await?;

    Ok(id.to_string())
}
