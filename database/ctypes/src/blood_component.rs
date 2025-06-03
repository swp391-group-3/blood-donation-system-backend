use postgres_types::{FromSql, ToSql};

#[derive(
    Debug, Clone, PartialEq, Eq, Hash, ToSql, FromSql, serde::Serialize, serde::Deserialize,
)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "blood_component", rename_all = "snake_case")]
pub enum BloodComponent {
    RedCell,
    Platelet,
    Plasma,
}
