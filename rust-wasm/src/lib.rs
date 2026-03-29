use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn hello() -> String {
    "hello".to_string()
}