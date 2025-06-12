use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Redirect},
};
use tower_sessions::Session;

use crate::{config::oidc::Provider, state::ApiState};

use super::KEY;

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
