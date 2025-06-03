use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{database, error::Result, state::ApiState};

#[derive(Deserialize, ToSchema)]
#[schema(as = health::create::Request)]
pub struct Request {
    pub temperature: f32,
    pub weight: f32,
    pub height: f32,
    pub is_good_health: bool,
    pub note: Option<String>,
}

#[utoipa::path(
    post,
    tags = ["Health", "Appointment"],
    path = "/appointment/{id}/health",
    operation_id = "health::create",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let id = database::health::create(
        appointment_id,
        request.temperature,
        request.weight,
        request.height,
        request.is_good_health,
        request.note.as_deref(),
        &state.database_pool,
    )
    .await?;

    Ok(Json(id))
}
