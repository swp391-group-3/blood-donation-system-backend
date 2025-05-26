use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Deserialize, ToSchema)]
#[schema(title = "Register Request")]
pub struct Request {
    pub email: String,
    pub password: String,
}
