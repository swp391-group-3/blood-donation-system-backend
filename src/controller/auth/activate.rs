use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, account::AccountDetail},
    error::Result,
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/activate",
    request_body = AccountDetail,
)]
pub async fn activate(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
    Json(detail): Json<AccountDetail>,
) -> Result<()> {
    database::account::activate(claims.sub, &detail, &state.database_pool).await?;

    Ok(())
}
