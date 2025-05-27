use tower_sessions::{
    Expiry, MemoryStore, SessionManagerLayer,
    cookie::{SameSite, time::Duration},
};

pub fn session() -> SessionManagerLayer<MemoryStore> {
    let session_store = MemoryStore::default();

    SessionManagerLayer::new(session_store)
        .with_secure(true)
        .with_same_site(SameSite::None)
        .with_http_only(true)
        .with_expiry(Expiry::OnInactivity(Duration::seconds(600)))
}
