use std::sync::Arc;

use axum::Router;
use utoipa::{
    Modify, OpenApi,
    openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme},
};
use utoipa_swagger_ui::SwaggerUi;

use super::{controller, state::ApiState};

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "jwt_token",
                SecurityScheme::Http(
                    HttpBuilder::new()
                        .scheme(HttpAuthScheme::Bearer)
                        .bearer_format("JWT")
                        .build(),
                ),
            )
        }
    }
}

#[derive(OpenApi)]
#[openapi(
    paths(
        controller::ping,

        controller::auth::register,
        controller::auth::login,
        controller::auth::google::google,
        controller::auth::microsoft::microsoft,
        controller::auth::activate,
        controller::auth::status,

        controller::question::create,
        controller::question::get_all,
        controller::question::update,
        controller::question::delete,

        controller::staff::create,
        controller::staff::get_all,
        controller::staff::get_by_id,
        controller::staff::get_by_name,
        controller::staff::delete,

        controller::blood_request::create,
        controller::blood_request::get_all,
        controller::blood_request::update,
        controller::blood_request::delete,
        controller::blood_request::create_appointment,

        controller::appointment::delete,

        controller::health::create,
        controller::health::update,
        controller::health::get_by_appointment_id,
        controller::health::get_by_member_id,

        controller::donation::create,
        controller::donation::get,
        controller::donation::get_all,
        controller::donation::get_by_member_id,
        controller::donation::update,
    ),
    modifiers(&SecurityAddon),
)]
struct ApiDoc;

pub fn build() -> Router<Arc<ApiState>> {
    SwaggerUi::new("/swagger-ui")
        .url("/api-docs/openapi.json", ApiDoc::openapi())
        .into()
}
