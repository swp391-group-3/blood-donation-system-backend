use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{controller::account::Account, error::Result, state::ApiState, util::jwt::Claims};

#[utoipa::path(
    get,
    tag = "Auth",
    path = "/auth/me",
    operation_id = "auth::me",
    responses(
        (status = Status::OK, body = Account)
    ),
    security(("jwt_token" = []))
)]
pub async fn me(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<Account>> {
    let database = state.database_pool.get().await?;

    let account = queries::account::get()
        .bind(&database, &claims.sub)
        .map(Account::from_get)
        .one()
        .await?;

    Ok(Json(account))
}
