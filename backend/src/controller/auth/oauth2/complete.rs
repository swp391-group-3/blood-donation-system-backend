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
use tower_sessions::Session;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    error::{AuthError, Error, Result},
    state::ApiState,
};

use super::KEY;

#[derive(Deserialize, ToSchema, Validate, Mapper)]
#[schema(as = oauth2::complete::request)]
#[mapper(
    into(custom = "with_email"),
    ty = RegisterParams::<String, String, String, String, String>,
    add(field = email, ty = String),
    add(field = password, ty = Option::<String>, default)
)]
pub struct Request {
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
    path = "/oauth2/complete",
    request_body = Request,
)]
pub async fn complete(
    state: State<Arc<ApiState>>,
    session: Session,
    jar: CookieJar,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<CookieJar> {
    let database = state.database_pool.get().await?;

    let email: String = session.remove(KEY).await.unwrap().unwrap();

    let id = queries::account::register()
        .params(&database, &request.with_email(email))
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
