use postgres_types::{FromSql, ToSql};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[postgres(name = "blood_group")]
pub enum BloodGroup {
    #[serde(rename = "O+")]
    #[postgres(name = "O+")]
    OPlus,
    #[serde(rename = "O-")]
    #[postgres(name = "O-")]
    OMinus,
    #[serde(rename = "A+")]
    #[postgres(name = "A+")]
    APlus,
    #[serde(rename = "A-")]
    #[postgres(name = "A-")]
    AMinus,
    #[serde(rename = "B+")]
    #[postgres(name = "B+")]
    BPlus,
    #[serde(rename = "B-")]
    #[postgres(name = "B-")]
    BMinus,
    #[serde(rename = "AB+")]
    #[postgres(name = "AB+")]
    ABPlus,
    #[serde(rename = "AB-")]
    #[postgres(name = "AB-")]
    ABMinus,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "role", rename_all = "snake_case")]
pub enum Role {
    Member,
    Staff,
    Admin,
}

#[derive(Debug, Clone, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "request_priority", rename_all = "snake_case")]
pub enum RequestPriority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "donation_type", rename_all = "snake_case")]
pub enum DonationType {
    WholeBlood,
    PowerRed,
    Platelet,
    Plasma,
}

#[derive(Debug, Clone, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "blood_component", rename_all = "snake_case")]
pub enum BloodComponent {
    RedCell,
    Platelet,
    Plasma,
}
