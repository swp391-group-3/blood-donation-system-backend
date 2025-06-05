use axum::http::{
    HeaderName, HeaderValue, Method,
    header::{
        ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
        ACCESS_CONTROL_ALLOW_ORIGIN, AUTHORIZATION, CONTENT_TYPE, ORIGIN,
    },
};
use config::{Config, Environment};
use serde::Deserialize;
use tower_http::cors::CorsLayer;

pub const CORS_ALLOW_HEADERS: [HeaderName; 7] = [
    ORIGIN,
    AUTHORIZATION,
    ACCESS_CONTROL_ALLOW_ORIGIN,
    CONTENT_TYPE,
    ACCEPT,
    ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_HEADERS,
];
pub const CORS_ALLOW_METHODS: [Method; 5] = [
    Method::GET,
    Method::POST,
    Method::DELETE,
    Method::PATCH,
    Method::PUT,
];

fn default_domain() -> String {
    "http://localhost:5173".to_string()
}

#[derive(Deserialize)]
pub struct CorsConfig {
    #[serde(default = "default_domain")]
    pub domain: String,
}

pub fn cors() -> CorsLayer {
    let config: CorsConfig = Config::builder()
        .add_source(Environment::default().prefix("CORS").try_parsing(true))
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap();

    let allow_origins = [config.domain.parse::<HeaderValue>().unwrap()];

    CorsLayer::new()
        .allow_origin(allow_origins)
        .allow_headers(CORS_ALLOW_HEADERS)
        .expose_headers(CORS_ALLOW_HEADERS)
        .allow_credentials(true)
        .allow_methods(CORS_ALLOW_METHODS)
}
