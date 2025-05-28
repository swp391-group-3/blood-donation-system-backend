// do routing here
pub mod create;
mod list;
mod get_by_id;
use std::sync::Arc;

use axum::{routing, Router};

use crate::state::ApiState;

pub use create::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blog/create", routing::post(create_blog))
}