use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    database::{self, account::*},
    error::Result,
    state::ApiState,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = staff::get_by_name::Request)]
pub struct Request {
    pub name: String,
}

#[utoipa::path(
    get,
    tag = "Staff",
    path = "/staff/search",
    operation_id = "staff::search",
    params(
        ("name" = String, Query, description = "Name of the staff to search for")
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_name(
    State(state): State<Arc<ApiState>>,
    Query(request): Query<Request>,
) -> Result<Json<Option<StaffDetail>>> {
    let account_details =
        database::account::get_staff_by_name(&request.name, &state.database_pool).await?;

    Ok(Json(account_details))
}
