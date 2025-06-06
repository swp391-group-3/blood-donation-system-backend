use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::CookieJar;
use database::{
    client::Params,
    queries::{self, account::RegisterParams},
};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    error::{AuthError, Error, Result},
    state::ApiState,
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
pub async fn register(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    request: Json<Request>,
) -> Result<CookieJar> {
    let database = state.database_pool.get().await?;

    let password = state
        .bcrypt_service
        .hash(&request.password)
        .map_err(|error| {
            tracing::error!(error =? error);
            AuthError::InvalidLoginData
        })?;

    let id = queries::account::register()
        .params(
            &database,
            &RegisterParams {
                email: &request.email,
                password,
            },
        )
        .one()
        .await
        .map_err(|error| {
            tracing::error!(error =? error);
            AuthError::AccountExisted
        })?;

    let cookie = state.jwt_service.new_credential(id).map_err(|error| {
        tracing::error!(error =? error);
        Error::from(AuthError::InvalidLoginData)
    })?;

    Ok(jar.add(cookie))
}
