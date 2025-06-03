use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, blog::*},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog/{id}",
    params(
        ("id" = Uuid, description = "Blog Id")
    ),
    responses(
        (status = 200, description = "Get Blog Successfully", body = Blog)
    )
)]
pub async fn get_by_id(
    Path(id): Path<Uuid>,
    State(state): State<Arc<ApiState>>,
) -> Result<Json<Option<Blog>>> {
    let blog = database::blog::get_by_id(id, &state.database_pool).await?;

    Ok(Json(blog))
}
