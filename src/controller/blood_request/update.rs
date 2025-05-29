use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    database::{self, blood_request::UpdateBloodRequest},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    put,
    tag = "Blood Request",
    path = "/blood-quest/{id}",
    operation_id = "blood_request::update",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    request_body = UpdateBloodRequest,
    security(("jwt_token" = []))
)]
pub async fn update(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateBloodRequest>,
) -> Result<()> {
    database::blood_request::update(id, &request, &state.database_pool).await?;

    Ok(())
}
