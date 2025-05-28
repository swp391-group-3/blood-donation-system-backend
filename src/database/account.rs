use std::str::FromStr;

use chrono::NaiveDate;
use serde::Deserialize;
use sqlx::{PgExecutor, Result};
use strum::{AsRefStr, EnumString};
use uuid::Uuid;

use crate::util;

use super::blood_group::BloodGroup;

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
            INSERT INTO accounts(email, password, role_id)
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

#[derive(Clone, Copy, Deserialize)]
#[repr(i32)]
pub enum Gender {
    Male,
    Female,
}

#[derive(Deserialize)]
pub struct AccountDetail {
    pub phone: String,
    pub name: String,
    pub gender: Gender,
    pub address: String,
    pub birthday: NaiveDate,
    pub blood_group: BloodGroup,
}

pub async fn activate(
    id: Uuid,
    detail: &AccountDetail,
    executor: impl PgExecutor<'_>,
) -> Result<()> {
    sqlx::query!(
        r#"
            UPDATE accounts
            SET
                phone = $2,
                name = $3,
                gender = $4,
                address = $5,
                birthday = $6,
                blood_group_id = (SELECT id FROM blood_groups WHERE name = $7),
                is_active = true
            WHERE id = $1
        "#,
        id,
        detail.phone,
        detail.name,
        detail.gender as i32,
        detail.address,
        detail.birthday,
        detail.blood_group.as_ref(),
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
