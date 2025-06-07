use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use axum_valid::Valid;
use database::{
    client::Params,
    queries::{self, blog::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blog::update::Request)]
#[mapper(
    into(custom = "with_account_context"),
    ty = UpdateParams::<String, String>,
    add(field = id, ty = Uuid),
    add(field = account_id, ty = Uuid)
)]
pub struct Request {
    pub title: Option<String>,
    pub content: Option<String>,
}

#[utoipa::path(
    patch,
    tag = "Blog",
    path = "/blog/{id}",
    operation_id = "blog::update",
    params(
        ("id" = Uuid, Path, description = "Blog id")
    ),
    request_body = Request,
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    claims: Claims,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::blog::update()
        .params(&database, &request.with_account_context(id, claims.sub))
        .await?;

    Ok(())
}
