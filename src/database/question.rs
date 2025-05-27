use sqlx::{PgExecutor, Result};

pub async fn create(content: String, executor: impl PgExecutor<'_>) -> Result<i32> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO questions(content)
            VALUES ($1)
            RETURNING id
        "#,
        content
    )
    .fetch_one(executor)
    .await
}
