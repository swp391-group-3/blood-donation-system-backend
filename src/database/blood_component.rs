use std::str::FromStr;

use serde::{Deserialize, Serialize};
use strum::{AsRefStr, EnumString};
use utoipa::ToSchema;

#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString, Serialize, Deserialize, ToSchema)]
#[strum(serialize_all = "snake_case")]
pub enum BloodComponent {
    Platelet,
    Plasma,
    #[strum(serialize = "red_cell")]
    RedCell,
}

impl From<String> for BloodComponent {
    fn from(value: String) -> Self {
        Self::from_str(&value).unwrap()
    }
}
