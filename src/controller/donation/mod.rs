mod create;
mod get;
mod get_all;
mod get_by_member_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::{database::account::Role, middleware, state::ApiState};

pub use create::*;
pub use get::*;
pub use get_all::*;
pub use get_by_member_id::*;
pub use update::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}/donation", routing::post(create))
        .route("/donation/{id}", routing::get(get))
        .route("/donation", routing::get(get_all))
        .route("/donation/{id}", routing::patch(update))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ))
        .route("/donation/self", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ))
}
