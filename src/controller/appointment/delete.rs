use std::sync::Arc;

use axum::extract::{Path, State};
use uuid::Uuid;

use crate::{database, error::Result, state::ApiState, util::auth::Claims};

#[utoipa::path(
    delete,
    tag = "Appointment",
    path = "/appointment/{id}",
    operation_id = "appointment::delete",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<()> {
    database::appointment::delete(id, claims.sub, &state.database_pool).await?;

    Ok(())
}
