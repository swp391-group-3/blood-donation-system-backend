use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use axum_valid::Valid;
use database::{
    client::Params,
    queries::{self, donation::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = donation::create::Request)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = CreateParams,
    add(field = appointment_id, ty = Uuid)
)]
pub struct Request {
    pub r#type: ctypes::DonationType,
    #[validate(range(min = 1))]
    pub amount: i32,
}

#[utoipa::path(
    post,
    tags = ["Donation", "Appointment"],
    path = "/appointment/{id}/donation",
    operation_id = "donation::create",
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    Path(appointment_id): Path<Uuid>,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::donation::create()
        .params(&database, &request.with_appointment_id(appointment_id))
        .one()
        .await?;

    Ok(Json(id))
}
