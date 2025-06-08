mod create;
mod delete;
mod update;

use std::sync::Arc;

use axum::{Router, routing};
use ctypes::Role;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use delete::*;
pub use update::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route(
            "/comment/{id}",
            routing::post(create).delete(delete).put(update),
        )
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ))
}
