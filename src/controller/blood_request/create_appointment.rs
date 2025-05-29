use std::{collections::HashSet, sync::Arc};

use anyhow::anyhow;
use axum::{
    Json,
    extract::{Path, State},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{database, error::Result, state::ApiState, util::auth::Claims};

#[derive(Deserialize, ToSchema)]
pub struct Answer {
    pub question_id: i32,
    pub content: String,
}

#[derive(Deserialize, ToSchema)]
#[schema(as = blood_request::create_appointment::Request)]
pub struct Request {
    #[schema(inline)]
    pub answers: Vec<Answer>,
}

#[utoipa::path(
    post,
    tag = "Blood Request",
    path = "/blood-request/{id}/create-appointment",
    operation_id = "blood_request::create_appointment",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn create_appointment(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let question_ids = database::question::get_all_id(&state.database_pool).await?;
    let submitted_question_ids = request
        .answers
        .iter()
        .map(|answer| answer.question_id)
        .collect::<HashSet<_>>();

    if question_ids != submitted_question_ids {
        return Err(anyhow!("Missing required questions").into());
    }

    let mut transaction = state.database_pool.begin().await?;

    let appointment_id = database::appointment::create(id, claims.sub, &mut *transaction).await?;

    for answer in request.answers {
        database::answer::create(
            answer.question_id,
            appointment_id,
            &answer.content,
            &mut *transaction,
        )
        .await?;
    }

    transaction.commit().await?;

    Ok(Json(appointment_id))
}
