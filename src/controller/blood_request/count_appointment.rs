use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{database, error::Result, state::ApiState};

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/{id}/count-appointment",
    operation_id = "blood_request::count_appointment",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    security(("jwt_token" = []))
)]
pub async fn count_appointment(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<i64>> {
    let count = database::blood_request::count_appointment(id, &state.database_pool).await?;

    Ok(Json(count))
}
