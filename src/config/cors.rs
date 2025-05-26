use axum::http::{
    HeaderName, Method,
    header::{
        ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
        ACCESS_CONTROL_ALLOW_ORIGIN, AUTHORIZATION, CONTENT_TYPE, ORIGIN,
    },
};
use serde::Deserialize;

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

impl CorsConfig {
    pub fn new() -> Self {
        ::config::Config::builder()
            .add_source(
                ::config::Environment::default()
                    .prefix("CORS")
                    .try_parsing(true),
            )
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }
}
