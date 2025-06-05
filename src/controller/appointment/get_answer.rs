use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries::{self, answer::GetByAppointmentIdBorrowed};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Debug, Serialize, ToSchema, Mapper)]
#[mapper(from, ty = GetByAppointmentIdBorrowed::<'_>)]
pub struct Answer {
    pub question: String,
    pub answer: String,
}

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/{id}/answer",
    operation_id = "appointment::get_answer",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = [])),
    responses(
        (status = Status::OK, body = Vec<Answer>)
    )
)]
pub async fn get_answer(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Answer>>> {
    let answers = queries::answer::get_by_appointment_id()
        .bind(&state.database_pool.get().await?, &id)
        .map(|raw| raw.into())
        .all()
        .await?;

    Ok(Json(answers))
}
