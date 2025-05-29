use sqlx::{PgExecutor, Result};
use uuid::Uuid;

pub async fn create(
    request_id: Uuid,
    member_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO appointments(request_id, member_id)
            VALUES ($1, $2)
            RETURNING id
        "#,
        request_id,
        member_id
    )
    .fetch_one(executor)
    .await
}

pub async fn delete(id: Uuid, executor: impl PgExecutor<'_>) -> Result<()> {
    sqlx::query!("DELETE FROM appointments WHERE id = $1", id)
        .execute(executor)
        .await?;

    Ok(())
}
