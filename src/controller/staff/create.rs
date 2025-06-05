use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use database::{
    client::Params,
    queries::{self, account::CreateStaffParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    config::CONFIG,
    error::{AuthError, Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[derive(Deserialize, ToSchema, Mapper)]
#[schema(as = staff::create::Request)]
#[mapper(
    into,
    ty = CreateStaffParams::<String, String, String, String>,
)]
pub struct Request {
    pub email: String,
    pub password: String,
    pub phone: String,
    pub name: String,
}

#[utoipa::path(
    post,
    tag = "Staff",
    path = "/staff",
    operation_id = "staff::create",
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(mut request): Json<Request>,
) -> Result<CookieJar> {
    let database = state.database_pool.get().await?;

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
    request.password = password;

    let id = queries::account::create_staff()
        .params(&database, &request.into())
        .one()
        .await?;

    let cookie: Cookie = Claims::new(id).try_into().map_err(|error| {
        tracing::error!(error =? error);
        Error::from(AuthError::InvalidLoginData)
    })?;

    Ok(jar.add(cookie))
}
