use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, health::Health},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tags = ["Health", "Appointment"],
    path = "/appointment/{id}/health",
    operation_id = "health::get_by_appoinment_id",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_appointment_id(
    State(state): State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
) -> Result<Json<Option<Health>>> {
    let health =
        database::health::get_by_appoinment_id(appointment_id, &state.database_pool).await?;

    Ok(Json(health))
}
