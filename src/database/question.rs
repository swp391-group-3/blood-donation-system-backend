use serde::Serialize;
use sqlx::{PgExecutor, Result};
use utoipa::ToSchema;

pub async fn create(content: &str, executor: impl PgExecutor<'_>) -> Result<i32> {
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

#[derive(Serialize, ToSchema)]
pub struct Question {
    id: i32,
    content: String,
}

pub async fn get_all(executor: impl PgExecutor<'_>) -> Result<Vec<Question>> {
    sqlx::query_as!(
        Question,
        r#"
            SELECT id, content
            FROM questions
            WHERE is_active = true
            ORDER BY id
        "#
    )
    .fetch_all(executor)
    .await
}

pub async fn update(id: i32, new_content: &str, executor: impl PgExecutor<'_>) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE questions
            SET content = $2
            WHERE id = $1
        "#,
        id,
        new_content
    )
    .execute(executor)
    .await?;

    Ok(())
}

pub async fn delete(id: i32, executor: impl PgExecutor<'_>) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE questions
            SET is_active = false
            WHERE id = $1
        "#,
        id,
    )
    .execute(executor)
    .await?;

    Ok(())
}
