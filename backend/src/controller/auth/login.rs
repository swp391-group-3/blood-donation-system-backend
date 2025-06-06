use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::CookieJar;
use axum_valid::Valid;
use database::queries;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    error::{AuthError, Error, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema, Validate)]
#[schema(as = auth::login::Request)]
pub struct Request {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1))]
    pub password: String,
}

#[utoipa::path (
    post,
    tag = "Auth",
    path = "/auth/login",
    request_body = Request,
)]
pub async fn login(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<CookieJar> {
    let database = state.database_pool.get().await?;

    let account = queries::account::get_id_and_password()
        .bind(&database, &request.email)
        .opt()
        .await?
        .ok_or(AuthError::InvalidLoginData)?;

    let is_password_correct = !state
        .bcrypt_service
        .verify(&request.password, &account.password)
        .map_err(|_| AuthError::InvalidLoginData)?;

    if !is_password_correct {
        return Err(AuthError::InvalidLoginData.into());
    }

    let cookie = state
        .jwt_service
        .new_credential(account.id)
        .map_err(|error| {
            tracing::error!(error =? error);
            Error::from(AuthError::InvalidLoginData)
        })?;

    Ok(jar.add(cookie))
}
