use serde::Deserialize;

const fn default_cost() -> u32 {
    10
}

const fn default_salt() -> [u8; 16] {
    [0; 16]
}

#[derive(Debug, Deserialize)]
pub struct BcryptConfig {
    #[serde(default = "default_cost")]
    pub cost: u32,

    #[serde(default = "default_salt")]
    pub salt: [u8; 16],
}

impl Default for BcryptConfig {
    fn default() -> Self {
        Self {
            cost: default_cost(),
            salt: default_salt(),
        }
    }
}
