mod create;
mod get_all;
mod get_by_id;
mod get_by_name;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use get_all::*;
pub use get_by_id::*;
pub use get_by_name::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/staff/create", routing::post(create))
        .route("/staff/get_all",routing::get(get_all))
        .route("/staff/get_by_id", routing::post(get_by_id))
        .route("/staff/get_by_name", routing::post(get_by_name))
}
