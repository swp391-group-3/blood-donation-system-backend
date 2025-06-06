use std::sync::Arc;

use axum::extract::{Path, State};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    delete,
    tag = "Account",
    path = "/account/{id}",
    operation_id = "account::delete",
    params(
        ("id" = Uuid, Path, description = "The UUID of the account")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::account::delete().bind(&database, &id).await?;

    Ok(())
}
