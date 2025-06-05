use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, account::GetAuthStatus};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{error::Result, state::ApiState, util::auth::Claims};

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(from, ty = GetAuthStatus)]
pub struct AuthStatus {
    pub is_active: bool,
    pub role: Role,
}

#[utoipa::path(
    get,
    tag = "Auth",
    path = "/auth/status",
    responses(
        (status = Status::OK, body = Option<AuthStatus>)
    )
)]
#[axum::debug_handler]
pub async fn status(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Option<AuthStatus>>> {
    let database = state.database_pool.get().await?;

    let status = queries::account::get_auth_status()
        .bind(&database, &claims.sub)
        .map(AuthStatus::from)
        .opt()
        .await?;

    Ok(Json(status))
}
