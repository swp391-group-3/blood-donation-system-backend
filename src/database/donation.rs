use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{PgExecutor, Result};
use utoipa::ToSchema;
use uuid::Uuid;

use super::donation_type::DonationType;

#[derive(Deserialize, ToSchema)]
pub struct CreateParams {
    pub r#type: DonationType,
    pub amount: i32,
}

pub async fn create(
    appointment_id: Uuid,
    params: &CreateParams,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO donations(appointment_id, type_id, amount)
            VALUES (
                $1,
                (SELECT id FROM donation_types WHERE name = $2),
                $3
            )
            RETURNING id
        "#,
        appointment_id,
        params.r#type.as_ref(),
        params.amount
    )
    .fetch_one(executor)
    .await
}

#[derive(Serialize, ToSchema)]
pub struct Donation {
    pub id: Uuid,
    pub appointment_id: Uuid,
    pub r#type: DonationType,
    pub amount: i32,
    pub created_at: DateTime<Utc>,
}

pub async fn get(id: Uuid, executor: impl PgExecutor<'_>) -> Result<Donation> {
    sqlx::query_as!(
        Donation,
        r#"
            SELECT donations.id, appointment_id, donation_types.name as type, amount, created_at
            FROM donations
            INNER JOIN donation_types ON donation_types.id = type_id
            WHERE donations.id = $1
        "#,
        id
    )
    .fetch_one(executor)
    .await
}

pub async fn get_by_member_id(
    member_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Vec<Donation>> {
    sqlx::query_as!(
        Donation,
        r#"
            SELECT donations.id, appointment_id, donation_types.name as type, amount, created_at
            FROM donations
            INNER JOIN donation_types ON donation_types.id = type_id
            WHERE appointment_id IN (SELECT id FROM appointments WHERE member_id = $1)
        "#,
        member_id
    )
    .fetch_all(executor)
    .await
}

pub async fn get_all(executor: impl PgExecutor<'_>) -> Result<Vec<Donation>> {
    sqlx::query_as!(
        Donation,
        r#"
            SELECT donations.id, appointment_id, donation_types.name as type, amount, created_at
            FROM donations
            INNER JOIN donation_types ON donation_types.id = type_id
        "#,
    )
    .fetch_all(executor)
    .await
}

#[derive(Deserialize, ToSchema)]
pub struct UpdateParams {
    pub r#type: Option<DonationType>,
    pub amount: Option<i32>,
}

pub async fn update(id: Uuid, params: &UpdateParams, executor: impl PgExecutor<'_>) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE donations
            SET
                type_id = COALESCE(
                    (SELECT id FROM donation_types WHERE name = $2),
                    type_id
                ),
                amount = COALESCE($3, amount)
            WHERE id = $1
        "#,
        id,
        params.r#type.as_ref().map(|x| x.as_ref()),
        params.amount
    )
    .execute(executor)
    .await?;

    Ok(())
}
