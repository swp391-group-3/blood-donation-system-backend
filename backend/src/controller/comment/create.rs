use std::sync::Arc;

use axum::{Json, extract::State};
use database::{
    client::Params,
    queries::{self, comment::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

#[derive(Deserialize, Mapper)]
#[mapper(
    into(custom = "with_account_id"),
    ty = CreateParams::<String>,
    add(field = account_id , ty = Uuid)
)]
pub struct Request {
    pub blog_id: Uuid,
    pub content: String,
}

pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::comment::create()
        .params(&database, &request.with_account_id(claims.sub))
        .one()
        .await?;

    Ok(Json(id))
}
