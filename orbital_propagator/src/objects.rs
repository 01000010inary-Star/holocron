#![allow(unused_imports, non_snake_case)]
use std::f64;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::PI;
use crate::util::*;

// ======== Output Body ========
// Data returned after calculating
// Keplerian coordinates
// ==============================

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct OutputBody {
    pub id: u32,
    pub x_orbital_plane: f64,
    pub y_orbital_plane: f64,
    pub z_orbital_plane: f64,

    pub x_ecliptic_plane: f64,
    pub y_ecliptic_plane: f64,
    pub z_ecliptic_plane: f64,

    pub x_equatorial: f64,
    pub y_equatorial: f64,
    pub z_equatorial: f64
}

impl OutputBody {
    pub fn default_with_id(id: u32) -> Self {
        Self {
            id,
            ..Self::default()
        }
    }
}

// ======== Input Body ========
// Body data from JPL API
// ============================
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct InputBody {
    pub id: u32,
    pub name: String,
    /// a
    pub semi_major_axis_au: f64,
    pub semi_major_axis_au_century: f64,
    /// e
    pub eccentricity_rad: f64,
    pub eccentricity_rad_century: f64,
    /// i
    pub inclination_deg: f64,
    pub inclination_deg_century: f64,
    /// om
    pub longitude_asc_node_deg: f64,
    pub longitude_asc_node_deg_century: f64,
    /// w
    pub longitude_perihelion_deg: f64,
    pub longitude_perihelion_deg_century: f64,

    pub mean_longitude_deg: f64,
    pub mean_longitude_deg_century: f64,

    pub julian_ephemeris_date: f64,
    pub centuries_past_j2000: f64,

    pub arg_perihelion: f64,
    pub mean_anomaly: f64,
}

impl InputBody {
    pub fn into_has_cords(&self, is_planet: bool) -> OutputBody {
        let mut out = OutputBody::default_with_id(self.id);
        get_cords(self, is_planet, &mut out);
        out
    }
}

pub fn get_cords(val: &InputBody, is_planet: bool, out: &mut OutputBody) {
    let updated_terms = modify_data_if_planet(val, is_planet);

    // Semi major axis
    let a = updated_terms.semi_major_axis;
    // Mean anomaly in radians
    let mut m = updated_terms.mean_anomaly.to_radians();
    // Arg of perihelion in radians
    let w = updated_terms.arg_perihelion.to_radians();

    // Update eccentricity if needed
    let e = updated_terms.eccentricity;

    // Normalizing mean anomaly to range [0, 2π) since already in radians
    m = m % (2.0 * PI);
    if m < 0.0 {
        m += 2.0 * PI;
    }

    // get eccentric anomaly via solving Kepler's equation
    let eccentric_anomaly = get_eccentric_anomaly(e, m);

    // compute heliocentric coordinates in orbital plane
    let x_cord = a * (eccentric_anomaly.cos() - e);
    let y_cord = a * (1.0 - e * e).sqrt() * eccentric_anomaly.sin();
    let z_cord = 0.0;

    // inclination and longitude of ascending node in radians
    let i = updated_terms.inclination.to_radians();
    let omega = updated_terms.longitude_asc_node.to_radians();

    // compute coordinates in ecliptic_plane
    let x_ecl = omega.cos() * x_cord - omega.sin() * i.cos() * y_cord;
    let y_ecl = omega.sin() * x_cord + omega.cos() * i.cos() * y_cord;
    let z_ecl = i.sin() * y_cord;

    // Obliquity of the ecliptic in radians
    let obliquity = 23.43928_f64.to_radians();

    // Compute equatorial coordinates
    let x_eq = x_ecl;
    let y_eq = y_ecl * obliquity.cos() - z_ecl * obliquity.sin();
    let z_eq = y_ecl * obliquity.sin() + z_ecl * obliquity.cos();

    out.x_orbital_plane = x_cord;
    out.y_orbital_plane = y_cord;
    out.z_orbital_plane = z_cord;

    out.x_ecliptic_plane = x_ecl;
    out.y_ecliptic_plane = y_ecl;
    out.z_ecliptic_plane = z_ecl;

    out.x_equatorial = x_eq;
    out.y_equatorial = y_eq;
    out.z_equatorial = z_eq;
}

/// e: Eccentricity
/// m: Mean anomaly (already in radians)
pub fn get_eccentric_anomaly(e: f64, m: f64) -> f64 {
    // series convergence factor
    let tol = 10.0_f64.powi(-6);
    // Basic starting point, convergence speed does not matter since iteration count is low
    // regardless
    let mut initial_e = m;
    let mut delta_e = 1.0_f64;

    while delta_e.abs() > tol {
        let next_e = initial_e - (initial_e - e * initial_e.sin() - m) / (1.0_f64 - e * initial_e.cos());
        delta_e = next_e - initial_e;
        initial_e = next_e;
    }

    initial_e
}

