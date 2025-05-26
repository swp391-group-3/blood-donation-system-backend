use axum::{Json, http::StatusCode, response::IntoResponse};

use super::ErrorResponse;

#[derive(Debug, thiserror::Error)]
pub enum AuthError {
    #[error("Invalid login data")]
    InvalidLoginData,

    #[error("Missing authentication token")]
    MissingAuthToken,

    #[error("Invalid authentication token")]
    InvalidAuthToken,

    #[error("Missing required permission")]
    MissingPermission,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> axum::response::Response {
        let status = match self {
            AuthError::InvalidLoginData => StatusCode::UNAUTHORIZED,
            AuthError::MissingAuthToken => StatusCode::UNAUTHORIZED,
            AuthError::InvalidAuthToken => StatusCode::UNAUTHORIZED,
            AuthError::MissingPermission => StatusCode::FORBIDDEN,
        };

        let response = ErrorResponse {
            message: self.to_string(),
        };

        (status, Json(response)).into_response()
    }
}
