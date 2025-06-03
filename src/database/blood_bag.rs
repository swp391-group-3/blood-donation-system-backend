use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
pub struct BloodBag {
    pub id: Uuid,
    pub donation_id: Uuid,
    pub blood_component: Option<String>,
    pub is_used: bool,
    pub amount: i32,
    pub expired_time: DateTime<Utc>,
}

pub async fn list(executor: impl sqlx::PgExecutor<'_>) -> sqlx::Result<Vec<BloodBag>> {
    sqlx::query_as!(
        BloodBag,
        r#"
            SELECT blood_bags.id, donation_id, blood_components.name AS blood_component, is_used, amount, expired_time
            FROM blood_bags 
                LEFT JOIN blood_components ON blood_bags.component_id = blood_components.id
        "#
    )
    .fetch_all(executor)
    .await
}
