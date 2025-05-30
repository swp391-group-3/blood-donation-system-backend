use serde::Deserialize;
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
