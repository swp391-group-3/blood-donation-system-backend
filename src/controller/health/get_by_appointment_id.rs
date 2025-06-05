use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::Health;

#[utoipa::path(
    get,
    tags = ["Health", "Appointment"],
    path = "/appointment/{id}/health",
    operation_id = "health::get_by_appoinment_id",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = Option<Health>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_appointment_id(
    state: State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
) -> Result<Json<Option<Health>>> {
    let database = state.database_pool.get().await?;

    let health = queries::health::get_by_appointment_id()
        .bind(&database, &appointment_id)
        .map(Health::from_get_by_appointment_id)
        .opt()
        .await?;

    Ok(Json(health))
}
