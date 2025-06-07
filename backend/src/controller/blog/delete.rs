use std::sync::Arc;

use axum::extract::{Path, State};
use database::queries::{self};
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

#[utoipa::path(
    delete,
    tag = "Blog",
    path = "/blog/{id}",
    operation_id = "blog::delete",
    params(
        ("id" = Uuid, Path, description = "Blog id")
    ),
)]
pub async fn delete(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    claims: Claims,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::blog::delete()
        .bind(&database, &id, &claims.sub)
        .await?;

    Ok(())
}
