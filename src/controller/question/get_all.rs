use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, question::Question},
    error::Result,
    state::ApiState,
};

#[utoipa::path(get, tag = "Question", path = "/question")]
#[axum::debug_handler]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<Question>>> {
    let questions = database::question::get_all(&state.database_pool).await?;

    Ok(Json(questions))
}
