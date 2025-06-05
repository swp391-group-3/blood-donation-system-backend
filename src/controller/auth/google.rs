use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use database::{
    client::Params,
    queries::{self, account::RegisterParams},
};
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    error::{AuthError, Result},
    state::ApiState,
    util::auth
};

const KEY: &str = "google";

#[utoipa::path(get, tag = "Auth", path = "/auth/google")]
pub async fn google(state: State<Arc<ApiState>>, session: Session) -> impl IntoResponse {
    let (auth_url, csrf, nonce) = util::auth::oidc::generate(&state.google_client);

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
    Query(query): Query<AuthRequest>,
) -> Result<String> {
    let database = state.database_pool.get().await?;

    let (csrf, nonce): (CsrfToken, Nonce) = session.get(KEY).await.unwrap().unwrap();

    let google_claims = util::auth::oidc::get_claims(
        AuthorizationCode::new(query.code),
        CsrfToken::new(query.state),
        csrf,
        nonce,
        &state.google_client,
        &state.http_client,
    )
    .await
    .unwrap();

    tracing::info!(claims =? google_claims);

    let email = google_claims
        .email()
        .expect("Google account must have email")
        .as_str();

    queries::account::register()
        .params(
            &database,
            &RegisterParams {
                email,
                password: None::<String>,
            },
        )
        .one()
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

    let token = generate_token(id).map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidAuthToken
    })?;

    Ok(token)
}
