use sqlx::{PgExecutor, Result};
use uuid::Uuid;

use crate::util;

pub async fn create(
    email: &str,
    password: Option<String>,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    let password = password.unwrap_or_else(util::auth::random_password);

    sqlx::query_scalar!(
        "INSERT INTO accounts(email, password) VALUES($1, $2) RETURNING id",
        email,
        password
    )
    .fetch_one(executor)
    .await
}

pub struct Account {
    pub id: Uuid,
    pub password: String,
}

pub async fn get_by_email(email: &str, executor: impl PgExecutor<'_>) -> Result<Option<Account>> {
    sqlx::query_as!(
        Account,
        "SELECT id, password FROM accounts WHERE email = $1 LIMIT 1",
        email
    )
    .fetch_optional(executor)
    .await
}
