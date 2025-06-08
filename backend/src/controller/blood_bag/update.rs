use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use axum_valid::Valid;
use chrono::{DateTime, FixedOffset, Utc};
use ctypes::BloodComponent;
use database::{
    client::Params,
    queries::{self, blood_bag::UpdateParams},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Validate)]
#[schema(as = blood_bag::update::Request)]
pub struct Request {
    pub component: Option<BloodComponent>,
    pub is_used: Option<bool>,
    #[validate(range(min = 1))]
    pub amount: Option<i32>,
    pub expired_time: Option<DateTime<Utc>>,
}

fn into_update_params(payload: Request, id: Uuid) -> UpdateParams {
    UpdateParams {
        component: payload.component,
        is_used: payload.is_used,
        amount: payload.amount,
        expired_time: payload
            .expired_time
            .map(|dt| dt.with_timezone(&FixedOffset::east_opt(0).unwrap())),
        id,
    }
}

#[utoipa::path(
    patch,
    tag = "Blood Bag",
    path = "/blood-bag/{id}",
    operation_id = "blood_bag::update",
    request_body = Request,
    params(
        ("id" = Uuid, Path, description = "Blood bag id")
    ),
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Valid(Json(payload)): Valid<Json<Request>>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    let params = into_update_params(payload, id);

    queries::blood_bag::update()
        .params(&database, &params)
        .await?;

    Ok(())
}
