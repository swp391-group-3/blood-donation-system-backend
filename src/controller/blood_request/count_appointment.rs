use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/{id}/count-appointment",
    operation_id = "blood_request::count_appointment",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    responses(
        (status = Status::OK, body = i64)
    ),
    security(("jwt_token" = []))
)]
pub async fn count_appointment(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<i64>> {
    let database = state.database_pool.get().await?;

    let count = queries::blood_request::count_appointment()
        .bind(&database, &id)
        .one()
        .await?;

    Ok(Json(count))
}
