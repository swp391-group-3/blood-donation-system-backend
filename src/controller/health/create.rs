use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::{
    client::Params,
    queries::{self, health::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper)]
#[schema(as = health::create::Request)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = CreateParams::<String>,
    add(field = appointment_id, ty = Uuid)
)]
pub struct Request {
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
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
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::health::create()
        .params(&database, &request.with_appointment_id(appointment_id))
        .one()
        .await?;

    Ok(Json(id))
}
