use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, account::AuthStatus},
    error::Result,
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(get, tag = "Auth", path = "/auth/status")]
#[axum::debug_handler]
pub async fn status(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Option<AuthStatus>>> {
    let status = database::account::get_auth_status(claims.sub, &state.database_pool).await?;

    Ok(Json(status))
}
