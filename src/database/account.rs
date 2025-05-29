use std::str::FromStr;

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::{PgExecutor, Result};
use strum::{AsRefStr, EnumString};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::util;

use super::blood_group::BloodGroup;

#[allow(unused)]
#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString, Serialize, ToSchema)]
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

pub async fn create_staff(
    email: &str,
    password: Option<String>,
    phone: &str,
    name: &str,
    gender: Gender,
    address: &str,
    birthday: NaiveDate,
    blood_group: BloodGroup,
    executor: impl PgExecutor<'_>,
) -> Result<Uuid> {
    let password = password.unwrap_or_else(util::auth::random_password);

    sqlx::query_scalar!(
        r#"
            INSERT INTO accounts(role_id, email, password, phone, name, gender, address, birthday, blood_group_id, is_active)
            VALUES(
                (SELECT id FROM roles WHERE name = 'staff'),
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                (SELECT id FROM blood_groups WHERE name = $8),
                true
            )
            RETURNING id
        "#,
        email,
        password,
        phone,
        name,
        gender as i32,
        address,
        birthday,
        blood_group.as_ref()
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

#[derive(Clone, Copy, Deserialize, ToSchema)]
#[repr(i32)]
pub enum Gender {
    Male,
    Female,
}

#[derive(Deserialize, ToSchema)]
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

#[derive(Serialize, ToSchema)]
pub struct AuthStatus {
    pub is_active: bool,
    pub role: Role,
}

pub async fn get_auth_status(
    id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Option<AuthStatus>> {
    match sqlx::query!(
        r#"
            SELECT is_active, roles.name as role
            FROM accounts
            INNER JOIN roles ON roles.id = role_id
            WHERE accounts.id = $1
        "#,
        id
    )
    .fetch_optional(executor)
    .await?
    {
        Some(raw) => {
            let role = Role::from_str(&raw.role).expect("Role from database must be valid");

            Ok(Some(AuthStatus {
                is_active: raw.is_active,
                role,
            }))
        }
        None => Ok(None),
    }
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
pub struct AccountOverview {
    pub email: String,
    pub phone: Option<String>,
    pub name: Option<String>,
    pub gender: Option<i32>,
    pub birthday: Option<NaiveDate>,
    pub blood_group: Option<String>,
}

pub async fn list_by_role(
    role: Role,
    executor: impl PgExecutor<'_>,
) -> Result<Vec<AccountOverview>> {
    sqlx::query_as!(
        AccountOverview,
        r#"
            SELECT email, phone, accounts.name, gender, birthday, blood_groups.name AS blood_group
            FROM accounts LEFT JOIN blood_groups ON accounts.blood_group_id = blood_groups.id
            WHERE role_id = (SELECT id FROM roles WHERE name = $1) AND is_active = true
        "#,
        role.as_ref()
    )
    .fetch_all(executor)
    .await
}

#[derive(Serialize)]
pub struct StaffDetail {
    pub id: Uuid,
    pub role: String,
    pub email: String,
    pub password: String,
    pub phone: Option<String>,
    pub name: Option<String>,
    pub gender: Option<i32>,
    pub address: Option<String>,
    pub birthday: Option<NaiveDate>,
    pub blood_group: Option<String>,
}

pub async fn get_staff_by_id(
    id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Option<StaffDetail>> {
    sqlx::query_as!(
        StaffDetail,
        r#"
            SELECT accounts.id, roles.name AS role, email, password, phone, accounts.name, gender, address, birthday, blood_groups.name AS blood_group
            FROM accounts
                LEFT JOIN roles ON accounts.role_id = roles.id
                LEFT JOIN blood_groups ON accounts.blood_group_id = blood_groups.id
            WHERE
                accounts.id = $1 AND roles.name = 'staff' AND is_active = true
            LIMIT 1
        "#,
        id
    )
    .fetch_optional(executor)
    .await
}

pub async fn get_staff_by_name(
    name: &str,
    executor: impl PgExecutor<'_>,
) -> Result<Option<StaffDetail>> {
    let pattern = format!("%{}%", name);
    sqlx::query_as!(
        StaffDetail,
        r#"
            SELECT accounts.id, roles.name AS role, email, password, phone, accounts.name, gender, address, birthday, blood_groups.name AS blood_group
            FROM accounts
                LEFT JOIN roles ON accounts.role_id = roles.id
                LEFT JOIN blood_groups ON accounts.blood_group_id = blood_groups.id
            WHERE
                accounts.name LIKE $1 AND roles.name = 'staff' AND is_active = true
            LIMIT 1
        "#,
        pattern
    )
    .fetch_optional(executor)
    .await
}