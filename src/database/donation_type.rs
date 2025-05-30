use std::str::FromStr;

use serde::{Deserialize, Serialize};
use strum::{AsRefStr, EnumString};
use utoipa::ToSchema;

#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString, Serialize, Deserialize, ToSchema)]
#[strum(serialize_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum DonationType {
    WholeBlood,
    PowerRed,
    Platelet,
    Plasma,
}

impl From<String> for DonationType {
    fn from(value: String) -> Self {
        Self::from_str(&value).unwrap()
    }
}
