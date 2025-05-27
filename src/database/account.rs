use std::str::FromStr;

use sqlx::{PgExecutor, Result};
use strum::{AsRefStr, EnumString};
use uuid::Uuid;
use serde::Serialize;

use crate::util;

#[allow(unused)]
#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString)]
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
            INSERT INTO accounts(email, password, role_id, is_active)
            VALUES(
                $1,
                $2,
                (SELECT id FROM roles WHERE name = $3),
                true
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

pub async fn create_if_not_existed(
    email: &str,
    password: Option<String>,
    role: Role,
    executor: impl PgExecutor<'_>,
) -> Result<()> {
    let password = password.unwrap_or_else(util::auth::random_password);

    sqlx::query!(
        r#"
            INSERT INTO accounts(email, password, role_id)
            VALUES(
                $1,
                $2,
                (SELECT id FROM roles WHERE name = $3)
            )
            ON CONFLICT DO NOTHING
        "#,
        email,
        password,
        role.as_ref()
    )
    .execute(executor)
    .await?;

    Ok(())
}

pub async fn get_role(id: Uuid, executor: impl PgExecutor<'_>) -> Result<Option<Role>> {
    let role = sqlx::query_scalar!(
        r#"
            SELECT name
            FROM roles
            WHERE id = (SELECT role_id FROM accounts WHERE id = $1)
        "#,
        id
    )
    .fetch_optional(executor)
    .await?
    .map(|raw| Role::from_str(&raw).unwrap());

    Ok(role)
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
#[derive(Serialize)]
pub struct AccountDetails{
    pub id: Uuid,
    pub email: String,
    pub password: String,
}

pub async fn list_by_role(
    role: Role,
    executor: impl PgExecutor<'_>,
) -> Result<Vec<AccountDetails>> {
    sqlx::query_as!(
        AccountDetails,
        r#"
            SELECT id, password, email
            FROM accounts
            WHERE role_id = (SELECT id FROM roles WHERE name = $1) AND is_active = true
        "#,
        role.as_ref()
    )
    .fetch_all(executor)
    .await
}