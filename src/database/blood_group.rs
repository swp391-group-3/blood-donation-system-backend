use strum::{AsRefStr, EnumString};

#[derive(PartialEq, Eq, Clone, Copy, AsRefStr, EnumString)]
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
