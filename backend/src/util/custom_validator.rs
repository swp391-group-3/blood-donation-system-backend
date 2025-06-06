use chrono::{DateTime, Utc};
use validator::ValidationError;

pub fn date_time_must_after_now(value: &DateTime<Utc>) -> Result<(), ValidationError> {
    let now = Utc::now();

    if value <= &now {
        return Err(ValidationError::new("date_time"));
    }

    Ok(())
}
