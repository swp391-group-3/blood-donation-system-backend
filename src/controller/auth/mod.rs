pub mod google;
mod login;
pub mod microsoft;
mod register;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use login::*;
pub use register::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/auth/register", routing::post(register))
        .route("/auth/login", routing::post(login))
        .route("/auth/google", routing::get(google::google))
        .route("/auth/google/authorized", routing::get(google::authorized))
        .route("/auth/microsoft", routing::get(microsoft::microsoft))
        .route(
            "/auth/microsoft/authorized",
            routing::get(microsoft::authorized),
        )
}
