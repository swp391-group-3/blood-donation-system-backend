use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::NaiveDate;
use ctypes::Gender;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::jwt::Claims};
use database::{
    client::Params,
    queries::{self, account::UpdateParams},
};

#[derive(Deserialize, ToSchema)]
pub struct Request {
    pub phone: Option<String>,
    pub name: Option<String>,
    pub gender: Option<Gender>,
    pub address: Option<String>,
    pub birthday: Option<NaiveDate>,
}

impl Request {
    pub fn with_account_id(
        self,
        account_id: Uuid,
    ) -> queries::account::UpdateParams<String, String, String> {
        UpdateParams {
            id: account_id,
            phone: self.phone,
            name: self.name,
            gender: self.gender,
            address: self.address,
            birthday: self.birthday,
        }
    }
}
#[utoipa::path(
    put,
    tag = "Account",
    path = "/account",
    request_body = Request,
    responses(
        (status = Status::OK)
    ),
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database_pool.get().await?;
    queries::account::update()
        .params(&database, &request.with_account_id(claims.sub))
        .await?;
    Ok(())
}
