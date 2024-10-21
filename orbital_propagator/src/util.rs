use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::PI;
use crate::objects::*;

#[cfg(target_arch = "wasm32")]
use js_sys::Date;

#[cfg(not(target_arch = "wasm32"))]
use std::time::{SystemTime, UNIX_EPOCH};

/// Returns the current Julian Date Number
/// NOTE: Non-WASM version only for locally running tests
pub fn get_current_julian_date() -> f64 {
    #[cfg(target_arch = "wasm32")]
    {
        let date = Date::new_0();
    
        let year = date.get_utc_full_year() as i32;
        let month = date.get_utc_month() as i32 + 1;
        let day = date.get_utc_date() as f64;
        let hour = date.get_utc_hours() as f64;
        let minute = date.get_utc_minutes() as f64;
        let second = date.get_utc_seconds() as f64;
    
        let ut = hour + minute / 60.0 + second / 3600.0;
    
        // Adjust for January and February
        let (year, month) = if month <= 2 {
            (year - 1, month + 12)
        } else {
            (year, month)
        };
    
        let a = (year as f64 / 100.0).floor();
        let b = 2.0 - a + (a / 4.0).floor();
    
        let jd = (365.25 * (year as f64 + 4716.0)).floor()
            + (30.6001 * (month as f64 + 1.0)).floor()
            + day + ut / 24.0 + b - 1524.5;
    
        jd
    }
    
    #[cfg(not(target_arch = "wasm32"))]
    {
        let start = SystemTime::now();
        let since_the_epoch = start.duration_since(UNIX_EPOCH)
            .expect("Time went backwards");
        let seconds_since_epoch = since_the_epoch.as_secs() as f64;
        let milliseconds_since_epoch = since_the_epoch.subsec_millis() as f64;

        // Get current UTC time
        let ut = (seconds_since_epoch + milliseconds_since_epoch / 1000.0) / 86400.0;

        // Convert UNIX timestamp to Julian Date
        // UNIX epoch to Julian epoch offset
        let jd = ut + 2440587.5; 
        jd
    }
}

pub fn modify_data_if_planet(val: &InputBody, is_planet: bool) -> CalculatedTerms {
    // Time in centuries since J2000
    let t = val.centuries_past_j2000;

    // Update orbital elements
    let a = val.semi_major_axis_au + val.semi_major_axis_au_century * t;
    let e = val.eccentricity_rad + val.eccentricity_rad_century * t;
    let i = val.inclination_deg + val.inclination_deg_century * t;
    let omega = val.longitude_asc_node_deg + val.longitude_asc_node_deg_century * t;
    let w_bar = val.longitude_perihelion_deg + val.longitude_perihelion_deg_century * t;
    let long = val.mean_longitude_deg + val.mean_longitude_deg_century * t;

    // Arg of perihelion
    let w = w_bar - omega;

    // Mean anomaly
    let mut mean_anomaly = long - w_bar;

    // Additional corrections for outer planets
    if let Some(p) = get_additional_planet_terms(&val.name) {
        let term_one = t * t * p.b;
        let ft = (p.f * t).to_radians();
        let term_two = p.c * ft.cos();
        let term_three = p.s * ft.sin();
        mean_anomaly += term_one + term_two + term_three;
    }

    CalculatedTerms {
        semi_major_axis: a,
        eccentricity: e,
        inclination: i,
        longitude_asc_node: omega,
        arg_perihelion: w,
        mean_anomaly,
    }
}

pub struct CalculatedTerms {
    pub semi_major_axis: f64,
    pub eccentricity: f64,
    pub inclination: f64,
    pub longitude_asc_node: f64,
    pub mean_anomaly: f64,
    pub arg_perihelion: f64
}

// =================================
// ==== Additional Planet Terms ====
// =================================

// =============================
// ==== For orbital periods ====
// =============================
// Mercury: Approximately 13 weeks
// Venus: Approximately 32 weeks
// Earth: Approximately 52 weeks (1 Earth year)
// Mars: Approximately 98 weeks
// Jupiter: Approximately 619 weeks
// Saturn: Approximately 1,537 weeks
// Uranus: Approximately 4,384 weeks
// Neptune: Approximately 8,599 weeks
// pub static MERCURY_WEEKS: u16 = 13;
// pub static VENUS_WEEKS: u16 = 32;
// pub static EARTH_WEEKS: u16 = 52;
// pub static MARS_WEEKS: u16 = 98;
// pub static JUPITER_WEEKS: u16 = 619;
// pub static SATURN_WEEKS: u16 = 1_537;
// pub static URANUS_WEEKS: u16 = 4_384;
// pub static NEPTUNE_WEEKS: u16 = 8_599;
pub static MERCURY_WEEKS: u16 = 14;
pub static VENUS_WEEKS: u16 = 33;
pub static EARTH_WEEKS: u16 = 53;
pub static MARS_WEEKS: u16 = 99;
pub static JUPITER_WEEKS: u16 = 620;
pub static SATURN_WEEKS: u16 = 1_538;
pub static URANUS_WEEKS: u16 = 4_385;
pub static NEPTUNE_WEEKS: u16 = 8_600;

pub static STEP_COUNT: u16 = 200;

// take the weeks, step through it for total of 200 steps
pub fn get_planet_steps(planet_name: &str) -> Vec<f64> {
    let orbit_period_weeks = match planet_name {
        "Mercury" => MERCURY_WEEKS,
        "Venus" => VENUS_WEEKS,
        "Earth" => EARTH_WEEKS,
        "Mars" => MARS_WEEKS,
        "Jupiter" => JUPITER_WEEKS,
        "Saturn" => SATURN_WEEKS,
        "Uranus" => URANUS_WEEKS,
        "Neptune" => NEPTUNE_WEEKS,
        _ => unreachable!(),
    };

    // current date as Julian centuries past J2000
    let curr_julian_date = get_current_julian_date();
    let curr_cent_past_j2000 = (curr_julian_date - 2451545.0_f64) / 36525.0_f64;

    // convert orbit period from weeks to Julian centuries
    let orbit_period_julian_centuries = f64::from(orbit_period_weeks) * 7.0 / 36525.0;

    // 1/2 of the orbit period (in Julian centuries)
    let half_orbit_period = orbit_period_julian_centuries / 2.0;

    // start 1/2 orbit period ago
    let start_date = curr_cent_past_j2000 - half_orbit_period;
    let step_value_julian_centuries = orbit_period_julian_centuries / f64::from(STEP_COUNT);

    let mut steps: Vec<f64> = Vec::with_capacity(STEP_COUNT as usize);

    for i in 0..STEP_COUNT {
        steps.push(start_date + (f64::from(i) * step_value_julian_centuries));
    }

    steps
}


// =============================
// ==== For orbital logic ======
// =============================
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


#[cfg(test)]
mod util_tests {
    use super::*;

    #[test]
    fn test_julian_date() {
        let curr_julian_date = get_current_julian_date();
        // let z = format!("Current Julian date: {}", curr_julian_date);
        println!("Current Julian date: {curr_julian_date}");
    }
}

