use std::sync::Arc;

use axum::{Json, extract::State};
use database::{
    client::Params,
    queries::{self, blog::CreateParams},
};
use model_mapper::Mapper;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::auth::Claims};

#[derive(Deserialize, Serialize, ToSchema, Mapper)]
#[schema(as = blod::create::Request)]
#[mapper(
    into(custom = "with_account_id"),
    ty = CreateParams::<String, String>,
    add(field = account_id, ty = Uuid),
)]
pub struct Request {
    pub title: String,
    pub content: String,
}

#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog",
    request_body = Request,
    responses(
        (status = 201, description = "Create blog successfully", body = Uuid),
        (status = 400, description = "Invalid data"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::blog::create()
        .params(&database, &request.with_account_id(claims.sub))
        .one()
        .await?;

    Ok(Json(id))
}
