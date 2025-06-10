mod activate;
pub mod google;
mod login;
pub mod microsoft;
pub mod oauth2;
mod register;
mod status;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use activate::*;
pub use login::*;
pub use register::*;
pub use status::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/auth/register", routing::post(register))
        .route("/auth/login", routing::post(login))
        .route("/auth/oauth2/{provider}", routing::get(oauth2::oauth2))
        .route(
            "/auth/oauth2/{provider}/authorized",
            routing::get(oauth2::authorized),
        )
}
