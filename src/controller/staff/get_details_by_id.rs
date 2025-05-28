use std::sync::Arc;

use axum::{Json, extract::State};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{self, account::*},
    error::Result,
    state::ApiState,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = staff::get_detailes_by_id::Request)]
pub struct Request{
    pub id: Uuid,
}

#[utoipa::path(
    post,
    tag = "Staff",
    path = "/staff/get_details_by_id",
    request_body = Request,
)]
pub async fn get_details_by_id(
    State(state): State<Arc<ApiState>>,
    Json(request): Json<Request>,
) -> Result<Json<Option<AccountDetails>>> {
    let account_details = database::account::get_detailes_by_id(request.id, &state.database_pool)
        .await?;

    Ok(Json(account_details))
}