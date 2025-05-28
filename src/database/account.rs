use std::str::FromStr;

use sqlx::{PgExecutor, Result};
use strum::{AsRefStr, EnumString};
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use chrono::NaiveDate;
use utoipa::ToSchema;

use crate::util;

#[allow(unused)]
#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString)]
#[strum(serialize_all = "snake_case")]
pub enum Role {
    Member,
    Staff,
    Admin,
}

#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString, Serialize, Deserialize, ToSchema)]
#[schema(example = "APlus")]
pub enum BloodGroup{
    #[strum(serialize = "A+")]
    APlus,
    #[strum(serialize = "A-")]
    AMinus,
    #[strum(serialize = "B+")]
    BPlus,
    #[strum(serialize = "B-")]
    BMinus,
    #[strum(serialize = "AB+")]
    ABPlus,
    #[strum(serialize = "AB-")]   
    ABMinus,
    #[strum(serialize = "O+")]
    OPlus,
    #[strum(serialize = "O-")]
    OMinus,
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
    gender: i32,
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
        gender,
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
pub struct AccountDetails {
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

pub async fn get_detailes_by_id(
    id: Uuid,
    executor: impl PgExecutor<'_>,
) -> Result<Option<AccountDetails>> {
    sqlx::query_as!(
        AccountDetails,
        r#"
            SELECT accounts.id, roles.name AS role, email, password, phone, accounts.name, gender, address, birthday, blood_groups.name AS blood_group
            FROM accounts
                LEFT JOIN roles ON accounts.role_id = roles.id
                LEFT JOIN blood_groups ON accounts.blood_group_id = blood_groups.id
            WHERE
                accounts.id = $1
        "#,
        id
    )
    .fetch_optional(executor)
    .await
}