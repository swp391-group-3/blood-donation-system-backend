use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, health::CreateHealth},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    post,
    tags = ["Health", "Appointment"],
    path = "/appointment/{id}/health",
    operation_id = "health::create",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    request_body = CreateHealth,
    security(("jwt_token" = []))
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
    Json(request): Json<CreateHealth>,
) -> Result<Json<Uuid>> {
    let id = database::health::create(appointment_id, &request, &state.database_pool).await?;

    Ok(Json(id))
}
