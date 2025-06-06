mod create;
mod delete;
mod get_all;
mod update;

use std::sync::Arc;

use axum::{Router, routing};
use ctypes::Role;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use delete::*;
pub use get_all::*;
pub use update::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/question", routing::post(create))
        .route("/question/{id}", routing::put(update))
        .route("/question/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Staff),
        ))
        .route("/question", routing::get(get_all))
}
