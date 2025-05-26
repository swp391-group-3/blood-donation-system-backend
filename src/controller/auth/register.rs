use std::sync::Arc;

use axum::{Json, extract::State};
use jsonwebtoken::Header;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    config::{CONFIG, KEYS},
    database,
    error::{AuthError, Result},
    state::ApiState,
    util::auth::Claims,
};

#[derive(Deserialize, ToSchema)]
#[schema(title = "Register Request")]
pub struct Request {
    pub email: String,
    pub password: String,
}

pub async fn register(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<String> {
    let password = bcrypt::hash_with_salt(
        request.password.as_bytes(),
        CONFIG.bcrypt.cost,
        CONFIG.bcrypt.salt,
    )
    .map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidLoginData
    })?
    .to_string();

    let id =
        database::account::create(&request.email, Some(password), &state.database_pool).await?;

    let token = jsonwebtoken::encode(
        &Header::default(),
        &Claims::new(id, CONFIG.jwt.expired_in),
        &KEYS.encoding,
    ).map_err(|error| {
            tracing::error!(error =? error)
            AuthError::InvalidLoginData
    })?;

    todo!()
}
