
use sqlx::{query_as, PgExecutor, Result};
use uuid::Uuid;
use serde::Serialize;
// Create Blog
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

#[derive(Debug, Serialize)]
pub struct BlogResponse{
    pub id: Uuid,
    pub account_id: Uuid,
    pub title: String,
    pub content: String
}

// get list of blogs
pub async fn get_list_of_blog(executor: impl PgExecutor<'_>) -> Result<Vec<BlogResponse>>{
    let blogs: Vec<BlogResponse> = query_as!(
        BlogResponse,
        r#"
            SELECT id, account_id, title, content
            FROM blogs
            ORDER BY created_at DESC
        "#
    ).fetch_all(executor)
    .await?;

    Ok(blogs)
}


