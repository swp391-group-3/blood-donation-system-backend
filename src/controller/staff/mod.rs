mod create;
mod list;
mod get_details_by_id;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use list::*;
pub use get_details_by_id::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/staff/create", routing::post(create))
        .route("/staff/list",routing::get(list))
        .route("/staff/get_details_by_id", routing::post(get_details_by_id))
}
