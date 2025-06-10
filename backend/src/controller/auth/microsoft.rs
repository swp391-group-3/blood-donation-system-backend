use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use axum_extra::extract::CookieJar;
use database::queries::{self};
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    config::oidc::FRONTEND_REDIRECT_URL, error::{AuthError, Result}, state::ApiState
};

const KEY: &str = "microsoft";

#[utoipa::path(get, tag = "Auth", path = "/auth/microsoft")]
pub async fn microsoft(state: State<Arc<ApiState>>, session: Session) -> impl IntoResponse {
    let (auth_url, csrf, nonce) = state.microsoft_client.generate();

    session.insert(KEY, (csrf, nonce)).await.unwrap();

    Redirect::to(auth_url.as_ref())
}

#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub code: String,
    pub state: String,
}

pub async fn authorized(
    state: State<Arc<ApiState>>,
    session: Session,
    jar: CookieJar,
    Query(query): Query<AuthRequest>,
) -> Result<impl IntoResponse> {
    let database = state.database_pool.get().await?;

    let (csrf, nonce): (CsrfToken, Nonce) = session.remove(KEY).await.unwrap().unwrap();

    let microsoft_claims = state
        .microsoft_client
        .get_claims(
            AuthorizationCode::new(query.code),
            CsrfToken::new(query.state),
            csrf,
            nonce,
        )
        .await
        .unwrap();

    tracing::info!(claims =? microsoft_claims);

    let email = microsoft_claims
        .email()
        .expect("Microsoft account must have email")
        .as_str();

    queries::account::oauth2_register()
        .bind(&database, &email)
        .await
        .map_err(|error| {
            tracing::error!(error =? error);
            AuthError::AccountExisted
        })?;

    let id = queries::account::get_id_and_password()
        .bind(&database, &email)
        .one()
        .await
        .expect("Account must be created in previous step to get here")
        .id;

    let cookie = state.jwt_service.new_credential(id).map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidAuthToken
    })?;

    Ok((jar.add(cookie), Redirect::to(&FRONTEND_REDIRECT_URL)))
}
