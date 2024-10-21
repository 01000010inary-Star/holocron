#![allow(unused_imports, non_snake_case)]
use std::f64;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::PI;
use crate::{get_planet_steps, objects::*, util::{get_current_julian_date, modify_data_if_planet}};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Orbit {
    pub id: u32,
    pub x_cords: Vec<f64>,
    pub y_cords: Vec<f64>,
    pub z_cords: Vec<f64>
}

impl Orbit {
    pub fn new(val: InputBody, is_planet: bool) -> Self {

        let steps = get_planet_steps(&val.name);

        // Map InputBody into vec<InputBody> with dates
        let bodies: Vec<InputBody> = steps.into_iter()
            .map(|step| {
                let b = InputBody {
                    centuries_past_j2000: step,
                    ..val.clone()
                };
                b
            })
            .collect();

        // Generate coordinates for each InputBody with the step date
        let date_bodies: Vec<OutputBody> = bodies
            .into_iter()
            .map(|body| {
                body.into_has_cords(is_planet)
            })
            .collect();

        let mut x_cords: Vec<f64> = vec![];
        let mut y_cords: Vec<f64> = vec![];
        let mut z_cords: Vec<f64> = vec![];

        for date_body in date_bodies.iter() {
            // x_cords.push(date_body.x_ecliptic_plane);
            // y_cords.push(date_body.y_ecliptic_plane);
            // z_cords.push(date_body.z_ecliptic_plane);
            x_cords.push(date_body.x_equatorial);
            y_cords.push(date_body.y_equatorial);
            z_cords.push(date_body.z_equatorial);
        };

        Self {
            id: val.id,
            x_cords,
            y_cords,
            z_cords
        }
    }
}

