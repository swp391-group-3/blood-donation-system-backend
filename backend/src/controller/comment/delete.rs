use axum::extract::{Path, State};
use std::sync::Arc;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};
use database::queries::{self};

pub async fn delete(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::comment::delete().bind(&database, &id).await?;

    Ok(())
}
