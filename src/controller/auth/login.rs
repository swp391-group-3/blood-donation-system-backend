use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::error::AuthError;
use crate::{Result, state::ApiState};
use crate::{database, util};

#[derive(Deserialize, ToSchema)]
#[schema(title = "Login Request")]
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
    let account = database::account::get_by_email(&request.email, &state.database_pool).await?;

    if !bcrypt::verify(request.password, &account.password).map_err(anyhow::Error::from)? {
        return Err(AuthError::InvalidLoginData.into());
    }

    let token = util::auth::generate_token(account.id)?;

    Ok(token)
}
