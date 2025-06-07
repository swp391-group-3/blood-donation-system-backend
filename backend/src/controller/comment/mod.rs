mod create;
mod delete;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use delete::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route(
        "/comment/{id}",
        routing::post(create).delete(delete).put(update),
    )
}
