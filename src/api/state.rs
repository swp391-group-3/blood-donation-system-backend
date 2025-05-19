use std::sync::Arc;

pub struct ApiState {}

impl ApiState {
    pub fn new() -> Arc<Self> {
        Arc::new(Self {})
    }
}
