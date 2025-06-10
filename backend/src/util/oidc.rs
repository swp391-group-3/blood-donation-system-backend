use anyhow::{Context, Result, ensure};
use openidconnect::{
    AuthenticationFlow, AuthorizationCode, CsrfToken, EndpointMaybeSet, EndpointNotSet,
    EndpointSet, Nonce, RedirectUrl, Scope,
    core::{
        CoreClient, CoreIdTokenClaims, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType,
    },
    reqwest,
    url::Url,
};

use crate::config::oidc::OpenIdConnectConfig;

type InnerClient = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointMaybeSet,
    EndpointMaybeSet,
>;

pub struct OpenIdConnectClient {
    inner_client: InnerClient,
    http_client: reqwest::Client,
}

impl OpenIdConnectClient {
    pub async fn from_config(config: crate::config::oidc::ClientConfig) -> Result<Self> {
        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()?;

        let provider_metadata =
            CoreProviderMetadata::discover_async(config.issuer_url, &http_client).await?;

        let inner_client = CoreClient::from_provider_metadata(
            provider_metadata,
            config.client_id,
            Some(config.client_secret),
        )
        .set_redirect_uri(config.redirect_url);

        Ok(Self {
            inner_client,
            http_client,
        })
    }

    pub fn generate(&self) -> (Url, CsrfToken, Nonce) {
        self.inner_client
            .authorize_url(
                AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
                CsrfToken::new_random,
                Nonce::new_random,
            )
            .add_scope(Scope::new("email".to_string()))
            .add_scope(Scope::new("profile".to_string()))
            .url()
    }

    pub async fn get_claims(
        &self,
        code: AuthorizationCode,
        state: CsrfToken,
        csrf: CsrfToken,
        nonce: Nonce,
    ) -> Result<CoreIdTokenClaims> {
        ensure!(state.secret() == csrf.secret(), "Invalid redirect");

        let token_response = self
            .inner_client
            .exchange_code(code)?
            .request_async(&self.http_client)
            .await?;

        let id_token_verifier: CoreIdTokenVerifier = self.inner_client.id_token_verifier();
        let id_token_claims: &CoreIdTokenClaims = token_response
            .extra_fields()
            .id_token()
            .context("Missing id token")?
            .claims(&id_token_verifier, &nonce)?;

        Ok(id_token_claims.clone())
    }
}
