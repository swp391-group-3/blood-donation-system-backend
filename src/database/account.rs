use sqlx::{PgExecutor, Result};
use uuid::Uuid;

pub async fn create(email: &str, password: &str, executor: impl PgExecutor<'_>) -> Result<Uuid> {
    sqlx::query_scalar!(
        "INSERT INTO accounts(email, password) VALUES($1, $2) RETURNING id",
        email,
        password
    )
    .fetch_one(executor)
    .await
}
