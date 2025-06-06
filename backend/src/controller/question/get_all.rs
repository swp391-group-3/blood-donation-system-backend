use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries::{self, question::GetAllBorrowed};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{error::Result, state::ApiState};

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(from, ty = GetAllBorrowed::<'_>)]
pub struct Question {
    pub id: i32,
    pub content: String,
}

#[utoipa::path(
    get,
    tag = "Question",
    path = "/question",
    operation_id = "question::get_all",
    responses(
        (status = Status::OK, body = Question)
    )
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Question>>> {
    let database = state.database_pool.get().await?;

    let questions = queries::question::get_all()
        .bind(&database)
        .map(|raw| raw.into())
        .all()
        .await?;

    Ok(Json(questions))
}
