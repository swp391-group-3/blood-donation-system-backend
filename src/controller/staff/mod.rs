mod create;
mod delete;
mod get;
mod get_all;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, NaiveDate, Utc};
use ctypes::{BloodGroup, Gender, Role};
use database::queries::account::{GetAllBorrowed, GetBorrowed};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get_all"), ty = GetAllBorrowed::<'_>))]
#[mapper(derive(from(custom = "from_get"), ty = GetBorrowed::<'_>))]
pub struct Account {
    pub role: Role,
    pub email: String,
    pub phone: String,
    pub name: String,
    pub gender: Option<Gender>,
    #[mapper(with = address.map(|x| x.to_string()))]
    pub address: Option<String>,
    pub birthday: Option<NaiveDate>,
    pub blood_group: Option<BloodGroup>,
    pub created_at: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/staff", routing::post(create))
        .route("/staff", routing::get(get_all))
        .route("/staff/{id}", routing::get(get))
        .route("/staff/{id}", routing::delete(delete))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Admin),
        ))
}
