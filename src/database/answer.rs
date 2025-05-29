use sqlx::{PgExecutor, Result};
use uuid::Uuid;

pub async fn create(
    question_id: i32,
    appointment_id: Uuid,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> Result<()> {
    sqlx::query!(
        r#"
            INSERT INTO answers(question_id, appointment_id, content)
            VALUES ($1, $2, $3)
        "#,
        question_id,
        appointment_id,
        content
    )
    .execute(executor)
    .await?;

    Ok(())
}
