use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use sqlx::{PgExecutor, Result};

#[derive(Deserialize, ToSchema)]
pub struct CreateHealth {
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: Option<String>,
}

pub async fn create(
    appointment_id: Uuid,
    params: &CreateHealth,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO healths(
                appointment_id,
                temperature,
                weight,
                upper_blood_pressure,
                lower_blood_pressure,
                heart_pulse,
                hemoglobin,
                is_good_health,
                note
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )
            RETURNING id
        "#,
        appointment_id,
        params.temperature,
        params.weight,
        params.upper_blood_pressure,
        params.lower_blood_pressure,
        params.heart_pulse,
        params.hemoglobin,
        params.is_good_health,
        params.note
    )
    .fetch_one(executor)
    .await
}

#[derive(Serialize, ToSchema)]
pub struct Health {
    pub id: Uuid,
    pub appointment_id: Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: Option<String>,
    pub created_at: DateTime<Utc>,
}

pub async fn get_by_appoinment_id(
    appointment_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Option<Health>> {
    sqlx::query_as!(
        Health,
        r#"
            SELECT *
            FROM healths
            WHERE appointment_id = $1
        "#,
        appointment_id
    )
    .fetch_optional(executor)
    .await
}

pub async fn get_by_member_id(
    member_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Vec<Health>> {
    sqlx::query_as!(
        Health,
        r#"
            SELECT *
            FROM healths
            WHERE appointment_id IN (SELECT id FROM appointments WHERE member_id = $1)
        "#,
        member_id
    )
    .fetch_all(executor)
    .await
}

#[allow(dead_code)]
#[derive(Deserialize, ToSchema)]
pub struct UpdateParams {
    pub temperature: Option<f32>,
    pub weight: Option<f32>,
    pub upper_blood_pressure: Option<i32>,
    pub lower_blood_pressure: Option<i32>,
    pub heart_pulse: Option<i32>,
    pub hemoglobin: Option<f32>,
    pub is_good_health: Option<bool>,
    pub note: Option<String>,
}

pub async fn update(id: Uuid, params: &UpdateParams, executor: impl PgExecutor<'_>) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE healths
            SET
                temperature = COALESCE($2, temperature),
                weight = COALESCE($3, weight),
                is_good_health = COALESCE($4, is_good_health),
                note = COALESCE($5, note)
            WHERE id = $1
        "#,
        id,
        params.temperature,
        params.weight,
        params.is_good_health,
        params.note
    )
    .execute(executor)
    .await?;

    Ok(())
}
