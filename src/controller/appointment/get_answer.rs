use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, answer::Answer},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/{id}/answer",
    operation_id = "appointment::get_answer",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = []))
)]
pub async fn get_answer(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Answer>>> {
    let answers = database::answer::get_by_appointment_id(id, &state.database_pool).await?;

    Ok(Json(answers))
}
