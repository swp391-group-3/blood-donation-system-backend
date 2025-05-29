use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, health::Health},
    error::Result,
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Health",
    path = "/health",
    operation_id = "health::get_by_member_id",
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Health>>> {
    let healths = database::health::get_by_member_id(claims.sub, &state.database_pool).await?;

    Ok(Json(healths))
}
