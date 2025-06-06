use std::sync::Arc;

use axum::{extract::{Path, State}, Json};
use database::{
    client::Params,
    queries::{self},
};
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::jwt::Claims};


#[utoipa::path(
    post,
    tag = "Comment",
    path = "/comment/{blog_id}",
    request_body = String,
    responses(
        (status = Status::OK, body = Uuid)
    )
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(blog_id): Path<Uuid>,
    Json(content): Json<String>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let params = queries::comment::CreateParams {
        account_id: claims.sub,
        blog_id,
        content
    };

    let id = queries::comment::create()
        .params(&database, &params)
        .one()
        .await?;

    Ok(Json(id))
}
