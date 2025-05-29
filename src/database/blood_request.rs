use std::str::FromStr;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{PgExecutor, Result};
use strum::{AsRefStr, EnumString};
use utoipa::ToSchema;
use uuid::Uuid;

use super::blood_group::BloodGroup;

#[derive(
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    AsRefStr,
    EnumString,
    Serialize,
    Deserialize,
    ToSchema,
)]
#[strum(serialize_all = "snake_case")]
pub enum Priority {
    Low,
    Medium,
    High,
}

impl From<String> for Priority {
    fn from(value: String) -> Self {
        Self::from_str(&value).unwrap()
    }
}

pub struct CreateBloodRequest {
    pub staff_id: Uuid,
    pub blood_group: BloodGroup,
    pub priority: Priority,
    pub title: String,
    pub max_people: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

pub async fn create(params: &CreateBloodRequest, executor: impl PgExecutor<'_>) -> Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO blood_requests(
                staff_id,
                blood_group_id,
                priority_id,
                title,
                max_people,
                start_time,
                end_time
            )
            VALUES (
                $1,
                (SELECT id FROM blood_groups WHERE name = $2),
                (SELECT id FROM request_priorities WHERE name = $3),
                $4,
                $5,
                $6,
                $7
            )
            RETURNING id
        "#,
        params.staff_id,
        params.blood_group.as_ref(),
        params.priority.as_ref(),
        params.title,
        params.max_people,
        params.start_time,
        params.end_time,
    )
    .fetch_one(executor)
    .await
}

#[derive(Serialize, ToSchema)]
pub struct BloodRequest {
    pub blood_group: BloodGroup,
    pub priority: Priority,
    pub title: String,
    pub max_people: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

pub async fn get_all(executor: impl PgExecutor<'_>) -> Result<Vec<BloodRequest>> {
    sqlx::query_as!(
        BloodRequest,
        r#"
            SELECT
                blood_groups.name as blood_group,
                request_priorities.name as priority,
                title,
                max_people,
                start_time,
                end_time
            FROM blood_requests
            INNER JOIN blood_groups ON blood_groups.id = blood_group_id
            INNER JOIN request_priorities ON request_priorities.id = priority_id
            WHERE now() < end_time AND is_active = true
        "#
    )
    .fetch_all(executor)
    .await
}

pub async fn get_booked(
    member_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Vec<BloodRequest>> {
    sqlx::query_as!(
        BloodRequest,
        r#"
            SELECT
                blood_groups.name as blood_group,
                request_priorities.name as priority,
                title,
                max_people,
                start_time,
                end_time
            FROM blood_requests
            INNER JOIN blood_groups ON blood_groups.id = blood_group_id
            INNER JOIN request_priorities ON request_priorities.id = priority_id
            WHERE blood_requests.id IN (
                SELECT request_id
                FROM appointments
                WHERE member_id = $1
            )
        "#,
        member_id
    )
    .fetch_all(executor)
    .await
}

#[derive(Deserialize, ToSchema)]
pub struct UpdateBloodRequest {
    pub priority: Option<Priority>,
    pub title: Option<String>,
    pub max_people: Option<i32>,
}

pub async fn update(
    id: Uuid,
    params: &UpdateBloodRequest,
    executor: impl PgExecutor<'_>,
) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE blood_requests
            SET
                priority_id = COALESCE(
                    (SELECT id FROM request_priorities WHERE name = $2),
                    priority_id
                ),
                title = COALESCE($3, title),
                max_people = COALESCE($4, max_people)
            WHERE id = $1
        "#,
        id,
        params.priority.map(|priority| priority.as_ref().to_owned()),
        params.title,
        params.max_people,
    )
    .execute(executor)
    .await?;

    Ok(())
}

pub async fn delete(id: Uuid, executor: impl PgExecutor<'_>) -> Result<()> {
    sqlx::query!(
        "UPDATE blood_requests SET is_active = false WHERE id = $1",
        id
    )
    .execute(executor)
    .await?;

    Ok(())
}
