use chrono::{DateTime, Utc};
use sqlx::{PgExecutor, Result};
use uuid::Uuid;

use super::blood_group::BloodGroup;

#[repr(i32)]
pub enum Priority {
    Low,
    Medium,
    High,
}

pub struct Create {
    pub staff_id: Uuid,
    pub blood_group: BloodGroup,
    pub priority: Priority,
    pub title: String,
    pub max_people: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

pub async fn create(params: &Create, executor: impl PgExecutor<'_>) -> Result<Uuid> {
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
                $3,
                $4,
                $5,
                $6,
                $7
            )
            RETURNING id
        "#,
        params.staff_id,
        params.blood_group.as_ref(),
        params.priority as i32,
        params.title,
        params.max_people,
        params.start_time,
        params.end_time,
    )
    .fetch_one(executor)
    .await
}
