use serde::Serialize;
use sqlx::{PgExecutor, Result, query_as};
use utoipa::ToSchema;
use uuid::Uuid;

// Create Blog
pub async fn create(
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

#[derive(Debug, Serialize, ToSchema)]
pub struct Blog {
    pub id: Uuid,
    pub account_id: Uuid,
    pub title: String,
    pub content: String,
}

// get list of blogs
pub async fn get_list(executor: impl PgExecutor<'_>) -> Result<Vec<Blog>> {
    let blogs: Vec<Blog> = query_as!(
        Blog,
        r#"
            SELECT id, account_id, title, content
            FROM blogs
            ORDER BY created_at DESC
        "#
    )
    .fetch_all(executor)
    .await?;

    Ok(blogs)
}

// get blog by id
pub async fn get_by_id(id: Uuid, executor: impl PgExecutor<'_>) -> Result<Option<Blog>> {
    let blog: Option<Blog> = query_as!(
        Blog,
        r#"
            SELECT id, account_id, title, content
            FROM blogs
            WHERE id = $1
        "#,
        id
    )
    .fetch_optional(executor)
    .await?;

    Ok(blog)
}

// search blog
