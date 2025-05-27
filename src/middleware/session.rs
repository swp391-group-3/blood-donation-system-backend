use tower_sessions::{Expiry, MemoryStore, SessionManagerLayer, cookie::time::Duration};

pub fn session() -> SessionManagerLayer<MemoryStore> {
    let session_store = MemoryStore::default();

    SessionManagerLayer::new(session_store)
        .with_secure(false)
        .with_expiry(Expiry::OnInactivity(Duration::seconds(600)))
}
