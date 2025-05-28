mod create;
mod delete;
mod get_all;
mod update;

use std::sync::Arc;

use axum::{
    Router,
    extract::{Request, State},
    middleware::Next,
    routing,
};

use crate::{database::account::Role, middleware, state::ApiState, util::auth::Claims};

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
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Staff], claims, state, request, next)
            },
        ))
        .route("/question", routing::get(get_all))
}
