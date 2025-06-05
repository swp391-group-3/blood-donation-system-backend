use std::{collections::HashSet, sync::Arc};

use anyhow::anyhow;
use axum::{
    Json,
    extract::{Path, State},
};
use database::{
    client::Params,
    queries::{self, appointment::CreateParams},
};
use futures::stream::TryStreamExt;
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::auth::Claims};

#[derive(Deserialize, ToSchema, Mapper)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = queries::answer::CreateParams::<String>,
    add(field = appointment_id, ty = Uuid)
)]
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
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create_appointment(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let mut database = state.database_pool.get().await?;

    let question_ids: HashSet<_> = queries::question::get_all()
        .bind(&database)
        .map(|raw| raw.id)
        .iter()
        .await?
        .try_collect()
        .await?;
    let submitted_question_ids = request
        .answers
        .iter()
        .map(|answer| answer.question_id)
        .collect::<HashSet<_>>();

    if question_ids != submitted_question_ids {
        return Err(anyhow!("Missing required questions").into());
    }

    let transaction = database.transaction().await?;

    let appointment_id = queries::appointment::create()
        .params(&transaction, &CreateParams {
            request_id: id,
            member_id: claims.sub,
        })
        .one()
        .await?;

    for answer in request.answers {
        queries::answer::create()
            .params(&transaction, &answer.with_appointment_id(appointment_id))
            .await?;
    }

    transaction.commit().await?;

    Ok(Json(appointment_id))
}
