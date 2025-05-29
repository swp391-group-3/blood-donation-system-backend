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

pub async fn authorize(
    roles: &[Role],
    claims: Claims,
    State(state): State<Arc<ApiState>>,
    request: Request,
    next: Next,
) -> Result<Response> {
    let auth_status = database::account::get_auth_status(claims.sub, &state.database_pool)
        .await?
        .ok_or(AuthError::InvalidAuthToken)?;

    if !auth_status.is_active {
        return Err(AuthError::ActivationRequired.into());
    }

    if !roles.contains(&auth_status.role) {
        return Err(AuthError::MissingPermission.into());
    }

    Ok(next.run(request).await)
}
