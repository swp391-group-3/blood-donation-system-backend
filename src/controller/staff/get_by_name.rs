use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    database::{self, account::*},
    error::Result,
    state::ApiState,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = staff::get_detailes_by_name::Request)]
pub struct Request{
    pub name: String,
}

#[utoipa::path(
    post,
    tag = "Staff",
    path = "/staff/get_by_name",
    request_body = Request,
)]
pub async fn get_by_name(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<Json<Option<StaffDetail>>> {
    let account_details = database::account::get_staff_by_name(&request.name, &state.database_pool)
        .await?;

    Ok(Json(account_details))
}