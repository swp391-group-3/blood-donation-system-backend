use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::NaiveDate;
use ctypes::BloodGroup;
use database::{
    client::Params,
    queries::{self, account::ActivateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::auth::Claims};

#[derive(Deserialize, ToSchema, Mapper)]
#[schema(as = auth::activate::Request)]
#[mapper(
    into(custom = "with_account_id"),
    ty = ActivateParams::<String, String, String>,
    add(field = id, ty = Uuid),
)]
pub struct ActivationRequest {
    pub phone: String,
    pub name: String,
    pub gender: i32,
    pub address: String,
    pub birthday: NaiveDate,
    pub blood_group: BloodGroup,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/activate",
    request_body = ActivationRequest,
)]
pub async fn activate(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(req): Json<ActivationRequest>,
) -> Result<()> {
    queries::account::activate()
        .params(
            &state.database_pool.get().await?,
            &req.with_account_id(claims.sub),
        )
        .await?;

    Ok(())
}
