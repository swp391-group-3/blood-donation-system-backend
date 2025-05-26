use axum::http::HeaderValue;
use tower_http::cors::CorsLayer;

use crate::config::{CONFIG, CORS_ALLOW_HEADERS, CORS_ALLOW_METHODS};

pub fn cors() -> CorsLayer {
    let allow_origins = [CONFIG.cors.domain.parse::<HeaderValue>().unwrap()];

    CorsLayer::new()
        .allow_origin(allow_origins)
        .allow_headers(CORS_ALLOW_HEADERS)
        .expose_headers(CORS_ALLOW_HEADERS)
        .allow_credentials(true)
        .allow_methods(CORS_ALLOW_METHODS)
}
