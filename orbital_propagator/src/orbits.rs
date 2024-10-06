#![allow(unused_imports, non_snake_case)]
use std::f64;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::{E, PI};
use crate::{objects::*, util::modify_data_if_planet};

pub fn get_sequence(len: u32) -> Vec<f64> {
    // vec of evenly spaced floats between -pi/pi, length = increment
    // [-pi, (-pi + step), (-pi + (step * 2)), (-pi + (step * 3)), ...]
    let seq: Vec<f64> = (0..len)
        .map(|i| {
            -PI + 2.0 * PI * (i as f64) / (len as f64 - 1.0)
        })
        .collect();
    seq
}


#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Orbit {
    id: u32,
    x_cords: Vec<f64>,
    y_cords: Vec<f64>,
    z_cords: Vec<f64>
}

impl Orbit {
    /// Generate a new flat ellipse from input body data (z-cords all 0)
    pub fn new_flat(val: &InputBody, is_planet: bool, num_points: Option<u32>) -> Self {

        let updated_terms = modify_data_if_planet(val, is_planet);
        let a = updated_terms.semi_major_axis;
        let e = val.eccentricity_rad;

        // semi-minor axis
        let semi_minor = a * (1.0 - e.powi(2)).sqrt();

        // distance from center to focus
        let distance_center = e * semi_minor;

        let seq = get_sequence(num_points.unwrap_or_else(|| 80));

        let x_cords: Vec<f64> = seq
            .iter().map(|&step| a * step.cos() - distance_center)
            .collect();
        let y_cords: Vec<f64> = seq
            .iter().map(|&step| semi_minor * step.sin())
            .collect();
        // all z cords flat for flat ellipse
        let z_cords: Vec<f64> = vec![0.0; 80];

        Self {
            id: val.id,
            x_cords,
            y_cords,
            z_cords
        }
    }

    /// Rotate a flat ellipsis into 3D space
    pub fn rotate_3D(&mut self, val: &InputBody, is_planet: bool) {

        let num_points = self.x_cords.len();

        let updated_terms = modify_data_if_planet(val, is_planet);

        // Pitch - rotating around y-axis w bodies inclination
        let pitch = val.inclination_deg.to_radians();
        // Yaw - rotating about z axis w bodies longitude asc node
        let yaw = val.longitude_asc_node_deg.to_radians();
        // Roll - rotation about x axis w arg_perihelion
        let roll = updated_terms.arg_perihelion.to_radians();

        for i in 0..num_points {
            let mut x = self.x_cords[i];
            let mut y = self.y_cords[i];
            let mut z = self.z_cords[i];

            // Apply pitch (rotation around y axis)
            let new_x_pitch = x * pitch.cos() + z * pitch.sin();
            let new_z_pitch = -x * pitch.sin() + z * pitch.cos();

            // Update x, z after pitch
            x = new_x_pitch;
            z = new_z_pitch;

            // Apply yaw (rotation around z axis)
            let new_x_yaw = x * yaw.cos() - y * yaw.sin();
            let new_y_yaw = x * yaw.sin() + y * yaw.cos();

            // Update x, y after yaw
            x = new_x_yaw;
            y = new_y_yaw;

            // Apply roll (rotation around xaxis)
            let new_y_roll = y * roll.cos() - z * roll.sin();
            let new_z_roll = y * roll.sin() + z * roll.cos();

            self.x_cords[i] = x;
            self.y_cords[i] = new_y_roll;
            self.z_cords[i] = new_z_roll; 
        }
    }
}

