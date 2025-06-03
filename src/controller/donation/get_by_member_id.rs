use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database::{self, donation::Donation},
    error::Result,
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation/self",
    operation_id = "donation::get_by_member_id",
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Donation>>> {
    let donation = database::donation::get_by_member_id(claims.sub, &state.database_pool).await?;

    Ok(Json(donation))
}
