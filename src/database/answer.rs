use serde::Serialize;
use sqlx::{PgExecutor, Result};
use utoipa::ToSchema;
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

#[derive(Serialize, ToSchema)]
pub struct Answer {
    pub question: String,
    pub answer: String,
}

pub async fn get_by_appointment_id(
    appointment_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Vec<Answer>> {
    sqlx::query_as!(
        Answer,
        r#"
            SELECT questions.content as question, answers.content as answer
            FROM answers
            INNER JOIN questions ON questions.id = answers.question_id
            WHERE appointment_id = $1
        "#,
        appointment_id
    )
    .fetch_all(executor)
    .await
}
