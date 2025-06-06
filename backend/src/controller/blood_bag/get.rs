use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::BloodBag;

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag/{id}",
    operation_id = "blood-bag::get",
    params(
        ("id" = Uuid, Path, description = "The UUID of the blood bag")
    ),
    responses(
        (status = Status::OK, body = Option<BloodBag>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<BloodBag>>> {
    let database = state.database_pool.get().await?;

    let blood_bags = queries::blood_bag::get()
        .bind(&database, &id)
        .map(BloodBag::from_get)
        .opt()
        .await?;

    Ok(Json(blood_bags))
}
