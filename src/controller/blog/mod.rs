mod create;
mod get_by_id;
mod get_list;

use crate::state::ApiState;
use axum::{
    Router,
    routing::{get, post},
};
use std::sync::Arc;

pub use create::*;
pub use get_by_id::*;
pub use get_list::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blog/create", post(create))
        .route("/blog/getList", get(get_list))
        .route("/blog/{id}", get(get_by_id))
}
