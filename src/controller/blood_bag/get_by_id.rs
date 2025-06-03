use axum::{
    Json,
    extract::{Path, State},
};
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    database::{self, blood_bag::BloodBag},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag/{id}",
    operation_id = "blood_bag::get_by_id",
    params(
        ("id" = Uuid, Path, description = "The UUID of the blood bag")
    ),
    security(("jwt_token" = []))
)]

pub async fn get_by_id(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<BloodBag>>> {
    let account_details = database::blood_bag::get_by_id(id, &state.database_pool).await?;

    Ok(Json(account_details))
}
