use sqlx::{PgExecutor, Result};
use strum::AsRefStr;
use uuid::Uuid;

use crate::util;

#[allow(unused)]
#[derive(Clone, Copy, AsRefStr)]
#[strum(serialize_all = "snake_case")]
pub enum Role {
    Member,
    Staff,
    Admin,
}

pub async fn create(
    email: &str,
    password: Option<String>,
    role: Role,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    let password = password.unwrap_or_else(util::auth::random_password);

    sqlx::query_scalar!(
        r#"
            INSERT INTO accounts(email, password, role)
            VALUES(
                $1,
                $2,
                (SELECT id FROM roles WHERE name = $3)
            )
            RETURNING id
        "#,
        email,
        password,
        role.as_ref()
    )
    .fetch_one(executor)
    .await
}

pub async fn check_role(id: Uuid, roles: &[Role], executor: impl PgExecutor<'_>) -> Result<bool> {
    let account_role = sqlx::query_scalar!(
        r#"
            SELECT name
            FROM roles
            WHERE id = (SELECT role FROM accounts WHERE id = $1)
        "#,
        id
    )
    .fetch_one(executor)
    .await?;

    let is_authorized = roles
        .iter()
        .filter(|role| role.as_ref() == account_role)
        .count()
        > 1;

    Ok(is_authorized)
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
