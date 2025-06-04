// This file was generated with `clorinde`. Do not modify.

#[cfg(all(feature = "chrono", not(feature = "time")))]
pub mod time {
    pub type Timestamp = chrono::NaiveDateTime;
    pub type TimestampTz = chrono::DateTime<chrono::FixedOffset>;
    pub type Date = chrono::NaiveDate;
    pub type Time = chrono::NaiveTime;
}
#[cfg(all(feature = "time", not(feature = "chrono")))]
pub mod time {
    pub type Timestamp = time::PrimitiveDateTime;
    pub type TimestampTz = time::OffsetDateTime;
    pub type Date = time::Date;
    pub type Time = time::Time;
}
#[derive(serde::Serialize, Debug, Clone, Copy, PartialEq, Eq)]
#[allow(non_camel_case_types)]
pub enum Role {
    member,
    staff,
    admin,
}
impl<'a> postgres_types::ToSql for Role {
    fn to_sql(
        &self,
        ty: &postgres_types::Type,
        buf: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        let s = match *self {
            Role::member => "member",
            Role::staff => "staff",
            Role::admin => "admin",
        };
        buf.extend_from_slice(s.as_bytes());
        std::result::Result::Ok(postgres_types::IsNull::No)
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "role" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 3 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "member" => true,
                    "staff" => true,
                    "admin" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
    fn to_sql_checked(
        &self,
        ty: &postgres_types::Type,
        out: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        postgres_types::__to_sql_checked(self, ty, out)
    }
}
impl<'a> postgres_types::FromSql<'a> for Role {
    fn from_sql(
        ty: &postgres_types::Type,
        buf: &'a [u8],
    ) -> Result<Role, Box<dyn std::error::Error + Sync + Send>> {
        match std::str::from_utf8(buf)? {
            "member" => Ok(Role::member),
            "staff" => Ok(Role::staff),
            "admin" => Ok(Role::admin),
            s => Result::Err(Into::into(format!("invalid variant `{}`", s))),
        }
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "role" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 3 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "member" => true,
                    "staff" => true,
                    "admin" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
}
#[derive(serde::Serialize, Debug, Clone, Copy, PartialEq, Eq)]
#[allow(non_camel_case_types)]
pub enum BloodGroup {
    O_,
    O_,
    A_,
    A_,
    B_,
    B_,
    AB_,
    AB_,
}
impl<'a> postgres_types::ToSql for BloodGroup {
    fn to_sql(
        &self,
        ty: &postgres_types::Type,
        buf: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        let s = match *self {
            BloodGroup::O_ => "O+",
            BloodGroup::O_ => "O-",
            BloodGroup::A_ => "A+",
            BloodGroup::A_ => "A-",
            BloodGroup::B_ => "B+",
            BloodGroup::B_ => "B-",
            BloodGroup::AB_ => "AB+",
            BloodGroup::AB_ => "AB-",
        };
        buf.extend_from_slice(s.as_bytes());
        std::result::Result::Ok(postgres_types::IsNull::No)
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "blood_group" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 8 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "O+" => true,
                    "O-" => true,
                    "A+" => true,
                    "A-" => true,
                    "B+" => true,
                    "B-" => true,
                    "AB+" => true,
                    "AB-" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
    fn to_sql_checked(
        &self,
        ty: &postgres_types::Type,
        out: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        postgres_types::__to_sql_checked(self, ty, out)
    }
}
impl<'a> postgres_types::FromSql<'a> for BloodGroup {
    fn from_sql(
        ty: &postgres_types::Type,
        buf: &'a [u8],
    ) -> Result<BloodGroup, Box<dyn std::error::Error + Sync + Send>> {
        match std::str::from_utf8(buf)? {
            "O+" => Ok(BloodGroup::O_),
            "O-" => Ok(BloodGroup::O_),
            "A+" => Ok(BloodGroup::A_),
            "A-" => Ok(BloodGroup::A_),
            "B+" => Ok(BloodGroup::B_),
            "B-" => Ok(BloodGroup::B_),
            "AB+" => Ok(BloodGroup::AB_),
            "AB-" => Ok(BloodGroup::AB_),
            s => Result::Err(Into::into(format!("invalid variant `{}`", s))),
        }
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "blood_group" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 8 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "O+" => true,
                    "O-" => true,
                    "A+" => true,
                    "A-" => true,
                    "B+" => true,
                    "B-" => true,
                    "AB+" => true,
                    "AB-" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
}
#[derive(serde::Serialize, Debug, Clone, Copy, PartialEq, Eq)]
#[allow(non_camel_case_types)]
pub enum RequestPriority {
    low,
    medium,
    high,
}
impl<'a> postgres_types::ToSql for RequestPriority {
    fn to_sql(
        &self,
        ty: &postgres_types::Type,
        buf: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        let s = match *self {
            RequestPriority::low => "low",
            RequestPriority::medium => "medium",
            RequestPriority::high => "high",
        };
        buf.extend_from_slice(s.as_bytes());
        std::result::Result::Ok(postgres_types::IsNull::No)
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "request_priority" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 3 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "low" => true,
                    "medium" => true,
                    "high" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
    fn to_sql_checked(
        &self,
        ty: &postgres_types::Type,
        out: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        postgres_types::__to_sql_checked(self, ty, out)
    }
}
impl<'a> postgres_types::FromSql<'a> for RequestPriority {
    fn from_sql(
        ty: &postgres_types::Type,
        buf: &'a [u8],
    ) -> Result<RequestPriority, Box<dyn std::error::Error + Sync + Send>> {
        match std::str::from_utf8(buf)? {
            "low" => Ok(RequestPriority::low),
            "medium" => Ok(RequestPriority::medium),
            "high" => Ok(RequestPriority::high),
            s => Result::Err(Into::into(format!("invalid variant `{}`", s))),
        }
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "request_priority" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 3 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "low" => true,
                    "medium" => true,
                    "high" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
}
#[derive(serde::Serialize, Debug, Clone, Copy, PartialEq, Eq)]
#[allow(non_camel_case_types)]
pub enum DonationType {
    whole_blood,
    power_red,
    platelet,
    plasma,
}
impl<'a> postgres_types::ToSql for DonationType {
    fn to_sql(
        &self,
        ty: &postgres_types::Type,
        buf: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        let s = match *self {
            DonationType::whole_blood => "whole_blood",
            DonationType::power_red => "power_red",
            DonationType::platelet => "platelet",
            DonationType::plasma => "plasma",
        };
        buf.extend_from_slice(s.as_bytes());
        std::result::Result::Ok(postgres_types::IsNull::No)
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "donation_type" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 4 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "whole_blood" => true,
                    "power_red" => true,
                    "platelet" => true,
                    "plasma" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
    fn to_sql_checked(
        &self,
        ty: &postgres_types::Type,
        out: &mut postgres_types::private::BytesMut,
    ) -> Result<postgres_types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        postgres_types::__to_sql_checked(self, ty, out)
    }
}
impl<'a> postgres_types::FromSql<'a> for DonationType {
    fn from_sql(
        ty: &postgres_types::Type,
        buf: &'a [u8],
    ) -> Result<DonationType, Box<dyn std::error::Error + Sync + Send>> {
        match std::str::from_utf8(buf)? {
            "whole_blood" => Ok(DonationType::whole_blood),
            "power_red" => Ok(DonationType::power_red),
            "platelet" => Ok(DonationType::platelet),
            "plasma" => Ok(DonationType::plasma),
            s => Result::Err(Into::into(format!("invalid variant `{}`", s))),
        }
    }
    fn accepts(ty: &postgres_types::Type) -> bool {
        if ty.name() != "donation_type" {
            return false;
        }
        match *ty.kind() {
            postgres_types::Kind::Enum(ref variants) => {
                if variants.len() != 4 {
                    return false;
                }
                variants.iter().all(|v| match &**v {
                    "whole_blood" => true,
                    "power_red" => true,
                    "platelet" => true,
                    "plasma" => true,
                    _ => false,
                })
            }
            _ => false,
        }
    }
}
