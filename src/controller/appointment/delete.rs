use std::sync::Arc;

use axum::extract::{Path, State};
use uuid::Uuid;

use crate::{database, error::Result, state::ApiState};

pub async fn delete(State(state): State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    database::appointment::delete(id, &state.database_pool).await?;

    Ok(())
}
