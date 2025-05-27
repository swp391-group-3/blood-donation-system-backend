use anyhow::{Context, Result, ensure};
use openidconnect::{
    AuthenticationFlow, AuthorizationCode, ClientId, ClientSecret, CsrfToken, EndpointMaybeSet,
    EndpointNotSet, EndpointSet, IssuerUrl, Nonce, RedirectUrl, Scope,
    core::{
        CoreClient, CoreIdTokenClaims, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType,
    },
    reqwest,
    url::Url,
};

pub type Client = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointMaybeSet,
    EndpointMaybeSet,
>;

pub async fn new(
    client_id: String,
    client_secret: String,
    issuer_url: String,
    redirect_url: String,
    http_client: &reqwest::Client,
) -> Result<Client> {
    let client_id = ClientId::new(client_id);
    let client_secret = ClientSecret::new(client_secret);
    let issuer_url = IssuerUrl::new(issuer_url)?;

    let provider_metadata = CoreProviderMetadata::discover_async(issuer_url, http_client).await?;

    Ok(
        CoreClient::from_provider_metadata(provider_metadata, client_id, Some(client_secret))
            .set_redirect_uri(RedirectUrl::new(redirect_url)?),
    )
}

pub fn generate(client: &Client) -> (Url, CsrfToken, Nonce) {
    client
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
    code: AuthorizationCode,
    state: CsrfToken,
    csrf: CsrfToken,
    nonce: Nonce,
    client: &Client,
    http_client: &reqwest::Client,
) -> Result<CoreIdTokenClaims> {
    ensure!(state.secret() == csrf.secret(), "Invalid redirect");

    let token_response = client
        .exchange_code(code)?
        .request_async(http_client)
        .await?;

    let id_token_verifier: CoreIdTokenVerifier = client.id_token_verifier();
    let id_token_claims: &CoreIdTokenClaims = token_response
        .extra_fields()
        .id_token()
        .context("Missing id token")?
        .claims(&id_token_verifier, &nonce)?;

    Ok(id_token_claims.clone())
}
