mod create;
mod list;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use list::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/staff/create", routing::post(create))
        .route("/staff/list",routing::get(list))
}
