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
