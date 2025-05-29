use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::{DateTime, Utc};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{
        self,
        blood_group::BloodGroup,
        blood_request::{CreateBloodRequest, Priority},
    },
    error::Result,
    state::ApiState,
    util::auth::Claims,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = blood_request::create::Request)]
pub struct Request {
    pub blood_group: BloodGroup,
    pub priority: Priority,
    pub title: String,
    pub max_people: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::create",
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let id = database::blood_request::create(
        &CreateBloodRequest {
            staff_id: claims.sub,
            blood_group: request.blood_group,
            priority: request.priority,
            title: request.title,
            max_people: request.max_people,
            start_time: request.start_time,
            end_time: request.end_time,
        },
        &state.database_pool,
    )
    .await?;

    Ok(Json(id))
}
