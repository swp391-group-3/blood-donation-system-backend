use std::sync::Arc;

use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};

use crate::{
    database::{self, account::Role},
    error::{AuthError, Result},
    state::ApiState,
    util::auth::Claims,
};

#[allow(unused)]
pub async fn authorize(
    roles: &[Role],
    claims: Claims,
    State(state): State<Arc<ApiState>>,
    request: Request,
    next: Next,
) -> Result<Response> {
    let role = database::account::get_role(claims.sub, &state.database_pool)
        .await?
        .ok_or(AuthError::InvalidAuthToken)?;

    if !roles.contains(&role) {
        return Err(AuthError::MissingPermission.into());
    }

    Ok(next.run(request).await)
}
