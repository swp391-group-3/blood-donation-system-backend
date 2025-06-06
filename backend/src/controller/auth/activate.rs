use std::sync::Arc;

use axum::{Json, extract::State};
use axum_valid::Valid;
use chrono::NaiveDate;
use ctypes::{BloodGroup, Gender};
use database::{
    client::Params,
    queries::{self, account::ActivateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = auth::activate::Request)]
#[mapper(
    into(custom = "with_account_id"),
    ty = ActivateParams::<String, String, String>,
    add(field = id, ty = Uuid),
)]
pub struct Request {
    #[validate(length(min = 10))]
    pub phone: String,
    #[validate(length(min = 1))]
    pub name: String,
    pub gender: Gender,
    #[validate(length(min = 1))]
    pub address: String,
    pub birthday: NaiveDate,
    pub blood_group: BloodGroup,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/activate",
    request_body = Request,
)]
pub async fn activate(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Valid(Json(req)): Valid<Json<Request>>,
) -> Result<()> {
    queries::account::activate()
        .params(
            &state.database_pool.get().await?,
            &req.with_account_id(claims.sub),
        )
        .await?;

    Ok(())
}
