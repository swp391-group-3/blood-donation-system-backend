use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::{
    client::Params,
    queries::{self, donation::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = CreateParams,
    add(field = appointment_id, ty = Uuid)
)]
pub struct CreateDonationRequest {
    pub r#type: ctypes::DonationType,
    pub amount: i32,
}

#[utoipa::path(
    post,
    tags = ["Donation", "Appointment"],
    path = "/appointment/{id}/donation",
    operation_id = "donation::create",
    request_body = CreateDonationRequest,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
    Json(request): Json<CreateDonationRequest>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::donation::create()
        .params(&database, &request.with_appointment_id(appointment_id))
        .one()
        .await?;

    Ok(Json(id))
}
