#[macro_export]
macro_rules! authorize {
    ($($role:expr),+) => {
        async |
            claims: $crate::util::jwt::Claims,
            state: axum::extract::State<std::sync::Arc<$crate::state::ApiState>>,
            request: axum::extract::Request,
            next: axum::middleware::Next,
        | -> $crate::error::Result<axum::response::Response> {
            let auth_status = database::queries::account::get_auth_status().bind(&state.database_pool.get().await?, &claims.sub)
                .opt()
                .await?
                .ok_or($crate::error::AuthError::InvalidAuthToken)?;

            if !auth_status.is_active {
                return Err($crate::error::AuthError::ActivationRequired.into());
            }

            $(
                if $role == auth_status.role {
                    return Ok(next.run(request).await)
                }
            )*

            Err($crate::error::AuthError::MissingPermission.into())
        }
    };
}

pub use authorize;
