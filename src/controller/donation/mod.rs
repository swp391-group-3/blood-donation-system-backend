mod create;
mod get;
mod get_all;
mod get_by_member_id;

use std::sync::Arc;

use axum::{
    Router,
    extract::{Request, State},
    middleware::Next,
    routing,
};

use crate::{database::account::Role, middleware, state::ApiState, util::auth::Claims};

pub use create::*;
pub use get::*;
pub use get_all::*;
pub use get_by_member_id::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}/donation", routing::post(create))
        .route("/donation/{id}", routing::get(get))
        .route("/donation", routing::get(get_all))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Staff], claims, state, request, next)
            },
        ))
        .route("/donation/self", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Member], claims, state, request, next)
            },
        ))
}
