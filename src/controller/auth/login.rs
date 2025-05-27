use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::error::AuthError;
use crate::{database, util};
use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema)]
#[schema(as = login::Request)]
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
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<String> {
    let account = database::account::get_by_email(&request.email, &state.database_pool)
        .await?
        .ok_or(AuthError::InvalidLoginData)?;

    if !bcrypt::verify(request.password, &account.password).map_err(AuthError::InvalidLoginData)? {
        return Err(AuthError::InvalidLoginData.into());
    }

    util::auth::generate_token(account.id).map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidLoginData.into()
    })
}
