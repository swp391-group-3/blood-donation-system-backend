use std::sync::Arc;

use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{self},
    error::{ Result},
    state::ApiState,
};


#[derive(Deserialize, Serialize, ToSchema)]
pub struct Request{ 
    pub account_id: Uuid,
    pub title: String,
    pub content: String,
}
#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog/create",
    params(
        ("request" = Request, description = "Request Object")
    ),
    responses(
        (status = 200, description = "Create blog successfully", body = String)
    )
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<String> {
    let id = database::blog::create(
        &request.account_id,
        &request.title,
        &request.content,
        &state.database_pool
    )
    .await?;

    Ok(id.to_string())
}
