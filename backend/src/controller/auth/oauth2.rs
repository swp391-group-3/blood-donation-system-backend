use std::sync::Arc;

use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Redirect},
};
use axum_extra::extract::CookieJar;
use database::queries;
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    config::CONFIG,
    config::oidc::Provider,
    error::{AuthError, Result},
    state::ApiState,
};

const KEY: &str = "oauth2";

#[utoipa::path(
    get,
    tag = "Auth",
    path = "/oauth2/{provider}",
    params(
        ("provider" = Provider, description = "OAuth2 Provider"),
    ),
)]
#[axum::debug_handler]
pub async fn oauth2(
    state: State<Arc<ApiState>>,
    session: Session,
    Path(provider): Path<Provider>,
) -> impl IntoResponse {
    let (auth_url, csrf, nonce) = state.oidc_clients[&provider].generate();

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
    Path(provider): Path<Provider>,
    Query(query): Query<AuthRequest>,
) -> Result<impl IntoResponse> {
    let database = state.database_pool.get().await?;

    let (csrf, nonce): (CsrfToken, Nonce) = session.remove(KEY).await.unwrap().unwrap();

    let claims = state.oidc_clients[&provider]
        .get_claims(
            AuthorizationCode::new(query.code),
            CsrfToken::new(query.state),
            csrf,
            nonce,
        )
        .await
        .unwrap();

    tracing::info!(claims =? claims);

    let email = claims.email().expect("Account must have email").as_str();

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

    Ok((
        jar.add(cookie),
        Redirect::to(&CONFIG.open_id_connect.frontend_redirect_url),
    ))
}
