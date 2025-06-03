use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{self, donation::CreateParams},
    error::Result,
    state::ApiState,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = donation::create::Request)]
pub struct Request(CreateParams);

#[utoipa::path(
    post,
    tags = ["Donation", "Appointment"],
    path = "/appointment/{id}/donation",
    operation_id = "donation::create",
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
    Json(Request(params)): Json<Request>,
) -> Result<Json<Uuid>> {
    let id = database::donation::create(appointment_id, &params, &state.database_pool).await?;

    Ok(Json(id))
}
