use axum::{
    Json,
    extract::{Path, State},
};
use std::sync::Arc;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};
use database::queries;

#[utoipa::path(
    put,
    tag = "Comment",
    path = "/comment/{id}",
    params(
        ("id" = Uuid, Path, description = "Comment Id")
    ),
    responses(
        (status = Status::OK)
    )
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(content): Json<String>,
) -> Result<()> {
    let database = state.database_pool.get().await?;
    queries::comment::update()
        .bind(&database, &content, &id)
        .await?;

    Ok(())
}
