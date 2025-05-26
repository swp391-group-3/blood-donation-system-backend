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

#[cfg(test)]
mod test_route_put_user_todos {
    use crate::api::build_test_server;

    #[tokio::test]
    async fn it_should_output_pong() {
        let server = build_test_server().await;

        let response = server.get("/").await.text();

        assert_eq!(response, "Pong")
    }
}
