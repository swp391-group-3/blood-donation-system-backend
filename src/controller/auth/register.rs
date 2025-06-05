use std::sync::Arc;

use axum::{Json, extract::State};
use database::{
    client::Params,
    queries::{self, account::RegisterParams},
};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    config::CONFIG,
    error::{AuthError, Result},
    state::ApiState,
    util::auth::generate_token,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = auth::register::request)]
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
pub async fn register(state: State<Arc<ApiState>>, request: Json<Request>) -> Result<String> {
    let database = state.database_pool.get().await?;

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

    let id = queries::account::register()
        .params(
            &database,
            &RegisterParams {
                email: &request.email,
                password: Some(password),
            },
        )
        .one()
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
