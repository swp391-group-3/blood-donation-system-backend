pub mod appointment;
pub mod auth;
pub mod blood_request;
pub mod donation;
pub mod health;
mod ping;
pub mod question;
pub mod staff;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(staff::build(state.clone()))
        .merge(question::build(state.clone()))
        .merge(blood_request::build(state.clone()))
        .merge(appointment::build(state.clone()))
        .merge(health::build(state.clone()))
        .merge(donation::build(state))
}
