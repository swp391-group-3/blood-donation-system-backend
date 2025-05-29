use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
use utoipa::ToSchema;
use chrono::NaiveDate;

use crate::{
    config::CONFIG,
    database::{self, blood_group::*, account::*},
    error::{AuthError, Result},
    state::ApiState,
    util::auth::generate_token,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = staff::create::Request)]
pub struct Request {
    pub email: String,
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
    tag = "Staff",
    path = "/staff/create",
    request_body = Request,
)]
pub async fn create(
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

    let id = database::account::create_staff(
        &request.email,
        Some(password),
        &request.phone,
        &request.name,
        request.gender,
        &request.address,
        request.birthday,
        request.blood_group,
        &state.database_pool,
    )
    .await?;

    let token = generate_token(id).map_err(|error| {
        tracing::error!(error =? error);
        AuthError::InvalidAuthToken
    })?;

    Ok(token)
}
