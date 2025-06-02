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
    request_body = Request,
    responses(
        (status = 201, description = "Create blog successfully", body = Uuid),
        (status = 400, description = "Invalid data"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let id = database::blog::create(
        &request.account_id,
        &request.title,
        &request.content,
        &state.database_pool
    )
    .await?;

    Ok(Json(id))
}
