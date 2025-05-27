use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    database::{self, account::Role},
    error::{AuthError, Result},
    state::ApiState,
    util::{self, auth::generate_token},
};

const KEY: &str = "microsoft";

#[utoipa::path(get, tag = "Auth", path = "/auth/microsoft")]
pub async fn microsoft(State(state): State<Arc<ApiState>>, session: Session) -> impl IntoResponse {
    let (auth_url, csrf, nonce) = util::auth::oidc::generate(&state.microsoft_client);

    session.insert(KEY, (csrf, nonce)).await.unwrap();

    Redirect::to(auth_url.as_ref())
}

#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub code: String,
    pub state: String,
}

pub async fn authorized(
    State(state): State<Arc<ApiState>>,
    session: Session,
    Query(query): Query<AuthRequest>,
) -> Result<String> {
    let (csrf, nonce): (CsrfToken, Nonce) = session.get(KEY).await.unwrap().unwrap();

    let microsoft_claims = util::auth::oidc::get_claims(
        AuthorizationCode::new(query.code),
        CsrfToken::new(query.state),
        csrf,
        nonce,
        &state.microsoft_client,
        &state.http_client,
    )
    .await
    .unwrap();

    tracing::info!(claims =? microsoft_claims);

    let email = microsoft_claims
        .email()
        .expect("Microsoft account must have email");

    database::account::create_if_not_existed(email, None, Role::Member, &state.database_pool)
        .await
        .map_err(|error| {
            tracing::error!(error =? error);
            AuthError::AccountExisted
        })?;

    let id = database::account::get_by_email(email, &state.database_pool)
        .await?
        .expect("Account must be created in previous step to get here")
        .id;

    let token = generate_token(id).map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidAuthToken
    })?;

    Ok(token)
}
