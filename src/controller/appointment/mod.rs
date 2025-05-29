mod delete;

use std::sync::Arc;

use axum::{
    Router,
    extract::{Request, State},
    middleware::Next,
    routing,
};

use crate::{database::account::Role, middleware, state::ApiState, util::auth::Claims};

pub use delete::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state,
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Member], claims, state, request, next)
            },
        ))
}
