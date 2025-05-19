mod ping;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub async fn build(router: Router<Arc<ApiState>>) -> Router<Arc<ApiState>> {
    router.route("/", routing::get(ping))
}
