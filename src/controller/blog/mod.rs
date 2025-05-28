// do routing here
pub mod create;
pub mod get_by_id;
pub mod list;
use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::state::ApiState;

pub use create::create_blog;
pub use list::get_list_of_blog;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blog/create", post(create_blog))
        .route("/blog/getList", get(get_list_of_blog))
}
