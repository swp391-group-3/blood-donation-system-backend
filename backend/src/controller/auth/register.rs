use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::CookieJar;
use axum_valid::Valid;
use chrono::NaiveDate;
use ctypes::{BloodGroup, Gender};
use database::{
    client::Params,
    queries::{self, account::RegisterParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    config::CONFIG,
    error::{AuthError, Error, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema, Validate, Mapper)]
#[schema(as = auth::register::request)]
#[mapper(into, ty = RegisterParams::<String, String, String, String, String>)]
pub struct Request {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1))]
    pub password: String,
    pub phone: String,
    pub name: String,
    pub gender: Gender,
    pub address: String,
    pub birthday: NaiveDate,
    pub blood_group: BloodGroup,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/register",
    request_body = Request,
)]
pub async fn register(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Valid(Json(mut request)): Valid<Json<Request>>,
) -> Result<CookieJar> {
    let database = state.database_pool.get().await?;

    let password =
        bcrypt::hash_with_salt(&request.password, CONFIG.bcrypt.cost, CONFIG.bcrypt.salt)
            .map_err(|error| {
                tracing::error!(error =? error);
                AuthError::InvalidLoginData
            })?
            .to_string();
    request.password = password;

    let id = queries::account::register()
        .params(&database, &request.into())
        .one()
        .await
        .map_err(|error| {
            tracing::error!(error =? error);
            AuthError::AccountExisted
        })?;

    let cookie = state.jwt_service.new_credential(id).map_err(|error| {
        tracing::error!(error =? error);
        Error::from(AuthError::InvalidLoginData)
    })?;

    Ok(jar.add(cookie))
}
