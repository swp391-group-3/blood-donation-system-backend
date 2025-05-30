mod create;
mod delete;
mod get_all;
mod get_by_id;
mod get_by_name;

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
pub use get_by_id::*;
pub use get_by_name::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/staff/create", routing::post(create))
        .route("/staff", routing::get(get_all))
        .route("/staff/{id}", routing::get(get_by_id))
        .route("/staff/search", routing::get(get_by_name))
        .route("/staff/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state,
            |state: State<Arc<ApiState>>, claims: Claims, request: Request, next: Next| {
                middleware::authorize(&[Role::Admin], claims, state, request, next)
            },
        ))
}
