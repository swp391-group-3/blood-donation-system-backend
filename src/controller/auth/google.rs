use std::sync::Arc;

use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{error::Result, state::ApiState, util};

const KEY: &str = "google";

#[utoipa::path(get, tag = "Auth", path = "/auth/google")]
pub async fn google(State(state): State<Arc<ApiState>>, session: Session) -> impl IntoResponse {
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
    State(state): State<Arc<ApiState>>,
    session: Session,
    Query(query): Query<AuthRequest>,
) -> Result<String> {
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

    println!("{:?}", google_claims);

    Ok("Test".to_string())
}
