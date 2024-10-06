#![allow(unused_imports, non_snake_case)]
use std::f64;
use std::f64::consts::{E, PI};

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};

mod objects;
use objects::*;
mod orbits;
use orbits::*;
mod util;

#[wasm_bindgen]
pub fn get_coordinates(input: &str, is_planet: bool) -> Result<String, JsValue> {

    let input_bodies: Vec<InputBody> = from_str(input)
        .map_err(|e| JsValue::from_str(&format!("Failure parsing bodies into structured type: {}", e)))?;

    let output_bodies: Vec<OutputBody> = input_bodies
        .into_iter()
        .map(|body| {
            body.into_has_cords(is_planet)
        })
        .collect();

    to_string(&output_bodies)
        .map_err(|e| JsValue::from_str(&format!(" err : {}", e)))

}

#[wasm_bindgen]
pub fn get_orbit_paths(input: &str, is_planet: bool) -> Result<String, JsValue> {
    let input_bodies: Vec<InputBody> = from_str(input)
        .map_err(|e| JsValue::from_str(&format!("Failure parsing bodies into structured type: {}", e)))?;

    let orbits_with_ids: Vec<Orbit> = input_bodies
        .into_iter()
        .map(|body| {
            let mut flat_orbit = Orbit::new_flat(&body, is_planet, Some(80));
            flat_orbit.rotate_3D(&body, is_planet);
            flat_orbit
        })
        .collect();

    to_string(&orbits_with_ids)
        .map_err(|e| JsValue::from_str(&format!("Err : {}", e)))
}


#[cfg(test)]
mod tests {
    use super::*;

    // fn get_test_body() -> InputBody {
    //
    //     let mars = InputBody {
    //         id: 4,
    //         semi_major_axis: 1.523679,
    //         eccentricity: 0.0934,
    //         inclination: 1.850_f64,
    //         longitude_asc_node: 49.558_f64,
    //         arg_perihelion: 286.502_f64,
    //         mean_anomaly: 19.373_f64,
    //         centuries_past_j2000: 0.0,
    //     };
    //
    //     mars
    // }

    #[test]
    fn test_input() {

    }
}
