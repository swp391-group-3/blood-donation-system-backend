use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    config::CONFIG,
    database::{self, account::Role},
    error::{AuthError, Result},
    state::ApiState,
    util::auth::generate_token,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = register::Request)]
pub struct Request {
    pub email: String,
    pub password: String,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/register",
    request_body = Request,
)]
pub async fn register(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<String> {
    let password = bcrypt::hash_with_salt(
        request.password.as_bytes(),
        CONFIG.bcrypt.cost,
        CONFIG.bcrypt.salt,
    )
    .map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidLoginData
    })?
    .to_string();

    let id = database::account::create(
        &request.email,
        Some(password),
        Role::Member,
        &state.database_pool,
    )
    .await
    .map_err(|error| {
        tracing::error!(error =? error);
        AuthError::AccountExisted
    })?;

    let token = generate_token(id).map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidAuthToken
    })?;

    Ok(token)
}
