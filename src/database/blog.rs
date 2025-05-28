// do database operations here

use sqlx::{PgExecutor, Result};
use uuid::Uuid;

// #[derive(Debug)]
// pub struct Blog {
//     pub id: Uuid,
//     pub account_id: Uuid,
//     pub title: String,
//     pub content: String,
// }

pub async fn create_blog(
    account_id: &Uuid,
    title: &str,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    let id = sqlx::query_scalar!(
        r#"
        INSERT INTO blogs (account_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING id
        "#,
        account_id,
        title,
        content
    )
    .fetch_one(executor)
    .await?;

    Ok(id)
}
