use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use sqlx::{PgExecutor, Result};

pub async fn create(
    appointment_id: Uuid,
    temperature: f32,
    weight: f32,
    height: f32,
    is_good_health: bool,
    note: Option<&str>,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO healths(appointment_id, temperature, weight, height, is_good_health, note)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id
        "#,
        appointment_id,
        temperature,
        weight,
        height,
        is_good_health,
        note
    )
    .fetch_one(executor)
    .await
}

#[derive(Deserialize, ToSchema)]
pub struct UpdateParams {
    pub temperature: Option<f32>,
    pub weight: Option<f32>,
    pub height: Option<f32>,
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
                height = COALESCE($4, height),
                is_good_health = COALESCE($5, is_good_health),
                note = COALESCE($6, note)
            WHERE id = $1
        "#,
        id,
        params.temperature,
        params.weight,
        params.height,
        params.is_good_health,
        params.note
    )
    .execute(executor)
    .await?;

    Ok(())
}
