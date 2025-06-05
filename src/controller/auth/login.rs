use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use database::queries;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    error::{AuthError, Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = auth::login::Request)]
pub struct Request {
    pub email: String,
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
    Json(request): Json<Request>,
) -> Result<CookieJar> {
    let database = state.database_pool.get().await?;

    let account = queries::account::get_id_and_password()
        .bind(&database, &request.email)
        .opt()
        .await?
        .ok_or(AuthError::InvalidLoginData)?;

    let is_password_correct = !bcrypt::verify(request.password, &account.password)
        .map_err(|_| AuthError::InvalidLoginData)?;

    if !is_password_correct {
        return Err(AuthError::InvalidLoginData.into());
    }

    let cookie: Cookie = Claims::new(account.id).try_into().map_err(|error| {
        tracing::error!(error =? error);
        Error::from(AuthError::InvalidLoginData)
    })?;

    Ok(jar.add(cookie))
}
