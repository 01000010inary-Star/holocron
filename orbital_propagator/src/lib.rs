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

    fn get_test_body() -> InputBody {

        let earth = InputBody {
            id: 3,
            name: "Earth".to_string(),
            semi_major_axis_au: 1.00000261,
            semi_major_axis_au_century: 0.00000562,
            eccentricity_rad: 0.01671123,
            eccentricity_rad_century: -0.00004392,
            inclination_deg: -0.00001531,
            inclination_deg_century: -0.01294668,
            longitude_asc_node_deg: 0.0,
            longitude_asc_node_deg_century: 0.0,
            longitude_perihelion_deg: 102.93768193,
            longitude_perihelion_deg_century: 0.32327364,
            mean_longitude_deg: 100.46457166,
            mean_longitude_deg_century: 35999.37244981,
            julian_ephemeris_date: 2451545.0,
            centuries_past_j2000: 0.0,
            arg_perihelion: 0.0,
            mean_anomaly: 0.0,
        };

        earth
    }

    #[test]
    fn test_orbit_coordinates() {
        let earth = get_test_body();

        let is_planet = true;

        let output_body = earth.into_has_cords(is_planet);

        let mut orbit = Orbit::new_flat(&earth, is_planet, Some(1000));
        orbit.rotate_3D(&earth, is_planet);

        let margin_of_error = 1e-6;

        let mut min_distance = std::f64::MAX;

        for i in 0..orbit.x_cords.len() - 1 {
            let dx = output_body.x_equatorial - orbit.x_cords[i];
            let dy = output_body.y_equatorial - orbit.y_cords[i];
            let dz = output_body.z_equatorial - orbit.z_cords[i];
            // let dx = output_body.x_orbital_plane - orbit.x_cords[i];
            // let dy = output_body.y_orbital_plane - orbit.y_cords[i];
            // let dz = output_body.z_orbital_plane - orbit.z_cords[i];
            
            let distance = (dx * dx + dy * dy + dz * dz).sqrt();

            if distance < min_distance {
                min_distance = distance;
            }
        }

        println!("================");
        println!(
            "Minimum distance between the body position and the orbit path: {:.10} AU",
            min_distance
        );
        println!("Acceptable margin of error: {:.10}", margin_of_error);
        println!("================");

        // assert!(
        //     min_distance <= margin_of_error,
        //     "====\nThe body position does not fall on the orbit path within the acceptable margin of error.\n===="
        // );

    }

}
