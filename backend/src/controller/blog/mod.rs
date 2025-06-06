mod create;
mod get;
mod get_all;

use crate::state::ApiState;
use axum::{Router, routing};
use database::queries::blog::{GetAllBorrowed, GetBorrowed};
use model_mapper::Mapper;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use utoipa::ToSchema;
use uuid::Uuid;

pub use create::*;
pub use get::*;
pub use get_all::*;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get"), ty = GetBorrowed::<'_>))]
#[mapper(derive(from(custom = "from_get_all"), ty = GetAllBorrowed::<'_>))]
pub struct Blog {
    pub id: Uuid,
    pub account_id: Uuid,
    pub title: String,
    pub content: String,
}

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blog", routing::post(create))
        .route("/blog", routing::get(get_all))
        .route("/blog/{id}", routing::get(get))
}
