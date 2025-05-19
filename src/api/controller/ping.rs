#[utoipa::path(
    get,
    path = "/",
    responses(
        (status = StatusCode::OK, description = "Return pong", body = &'static str)
    )
)]
pub async fn ping() -> &'static str {
    "Pong"
}
