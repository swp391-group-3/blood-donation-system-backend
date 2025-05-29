use std::str::FromStr;

use serde::{Deserialize, Serialize};
use strum::{AsRefStr, EnumString};
use utoipa::ToSchema;

#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString, Serialize, Deserialize, ToSchema)]
pub enum BloodGroup {
    #[strum(serialize = "O+")]
    OPlus,
    #[strum(serialize = "O-")]
    OMinus,
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
}

impl From<String> for BloodGroup {
    fn from(value: String) -> Self {
        Self::from_str(&value).unwrap()
    }
}
