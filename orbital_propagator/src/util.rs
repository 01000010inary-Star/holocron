use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::{E, PI};
use crate::objects::*;


pub static PLANETS_WITH_ADDITIONAL_TERMS: [&str; 4] = ["Jupiter", "Saturn", "Uranus", "Neptune"];

pub static JUPITER_DATA: [f64; 4] = [-0.00012452, 0.06064060, -0.35635438, 38.35125000];
pub static SATURN_DATA: [f64; 4] = [0.00025899, -0.13434469, 0.87320147, 38.35125000];
pub static URANUS_DATA: [f64; 4] = [0.00058331, -0.97731848, 0.17689245, 7.67025000];
pub static NEPTUNE_DATA: [f64; 4] = [-0.00041348, 0.68346318, -0.10162547, 7.67025000];

#[derive(Default)]
pub struct PlanetAdditionalTerms {
    pub b: f64,
    pub c: f64,
    pub s: f64,
    pub f: f64
}

pub fn get_additional_planet_terms(planet: &str) -> Option<PlanetAdditionalTerms> {
    if !PLANETS_WITH_ADDITIONAL_TERMS.contains(&planet) {
        None
    } else {
        let mut p = PlanetAdditionalTerms::default();
        match planet {
            "Jupiter" => {
                p.b = JUPITER_DATA[0];
                p.c = JUPITER_DATA[1];
                p.s = JUPITER_DATA[2];
                p.f = JUPITER_DATA[3];
            },
            "Saturn" => {
                p.b = SATURN_DATA[0];
                p.c = SATURN_DATA[1];
                p.s = SATURN_DATA[2];
                p.f = SATURN_DATA[3];
            },
            "Uranus" => {
                p.b = URANUS_DATA[0];
                p.c = URANUS_DATA[1];
                p.s = URANUS_DATA[2];
                p.f = URANUS_DATA[3];
            },
            "Neptune" => {
                p.b = NEPTUNE_DATA[0];
                p.c = NEPTUNE_DATA[1];
                p.s = NEPTUNE_DATA[2];
                p.f = NEPTUNE_DATA[3];
            },
            _ => unreachable!()
        }
        Some(p)
    }
}

pub struct CalculatedTerms {
    pub semi_major_axis: f64,
    pub mean_anomaly: f64,
    pub arg_perihelion: f64
}

pub fn modify_data_if_planet(val: &InputBody, is_planet: bool) -> CalculatedTerms {
    // Semi major axis
    let mut a: f64;
    // Mean anomaly
    let mut m: f64;
    // arg perihelion
    let mut w: f64;

    if is_planet {

        // If centuries past j2000 needs calculated
        // let c_past_j = (val.julian_ephemeris_date - 2451545.0_f64) / 36525.0_f64;

        // semi_major_axis
        a = val.semi_major_axis_au + (val.semi_major_axis_au_century * val.centuries_past_j2000);

        // Compute argument of perihelion
        let time_specific_long_perihelion = val.longitude_perihelion_deg + (val.longitude_perihelion_deg_century * val.centuries_past_j2000);

        let time_specific_longitude_asc_node = val.longitude_asc_node_deg + (val.longitude_asc_node_deg_century * val.centuries_past_j2000);

        w = time_specific_long_perihelion - time_specific_longitude_asc_node;

        // Compute mean anomaly
        let time_specific_mean_longitude = val.mean_longitude_deg + (val.mean_longitude_deg_century * val.centuries_past_j2000);

        let mut mean_anomaly = time_specific_mean_longitude - time_specific_long_perihelion;
        
        if let Some(p) = get_additional_planet_terms(&val.name) {
            let term_one = val.centuries_past_j2000.powi(2) * p.b;
            let ft = (p.f * val.centuries_past_j2000).to_radians();
            let term_two = p.c * ft.cos();
            let term_three = p.s * ft.sin();
            mean_anomaly = mean_anomaly + term_one + term_two + term_three;
        }

        m = mean_anomaly;
    } else {
        a = val.semi_major_axis_au;
        w = val.arg_perihelion;
        m = val.mean_anomaly;
    }

    CalculatedTerms {
        semi_major_axis: a,
        arg_perihelion: w,
        mean_anomaly: m
    }

}

