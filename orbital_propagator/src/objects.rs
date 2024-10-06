#![allow(unused_imports, non_snake_case)]
use std::f64;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::{E, PI};
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
#[derive(Serialize, Deserialize, Debug)]
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

pub fn get_cords(val: &InputBody, is_planet: bool, out: &mut OutputBody) -> () {

    let updated_terms = modify_data_if_planet(val, is_planet);

    // Semi major axis
    let mut a = updated_terms.semi_major_axis;
    // Mean anomaly
    let mut m = updated_terms.mean_anomaly;
    // arg perihelion
    let mut w = updated_terms.arg_perihelion;

    let e = val.eccentricity_rad;
    let e_deg = 180.0_f64 / PI * e;
    // Degrees
    let I = val.inclination_deg.to_radians();

    // Degrees
    let U = val.longitude_asc_node_deg.to_radians();

    // 3. Normalize mean anomaly into -180deg <= M <= 180deg
    m = m % 360.0;
    // let mut m = val.mean_anomaly % 360.0;
    if m > 180.0 {
        m = m - 360.0;
    } else if m < -180.0 {
        m = m + 360.0;
    }

    // 4. Get eccentric anomaly via solving Kepler's equation
    let eccentric_anomaly_radians = get_eccentric_anomaly(e, e_deg, m).to_radians();

    // 4. compute planets heliocentric coordinates in orbital plane
    let x_cord = a * (eccentric_anomaly_radians.cos() - e);
    let y_cord = a * (1.0_f64 - (e * e)).sqrt() * eccentric_anomaly_radians.sin();
    let z_cord = 0.0_f64;

    // 5. Compute coordinates in J2000 ecliptic plane, w x-axis aligned towards equinox
    w = w.to_radians();

    let x_ecl = {
        let a = ((w.cos() * U.cos()) - (w.sin() * U.sin() * I.cos())) * x_cord;
        let b = ((-1.0_f64 * w.sin() * U.cos()) - (w.cos() * U.sin() * I.cos())) * y_cord;
        a + b
    };

    let y_ecl = {
        let a = ((w.cos() * U.cos()) + (w.sin() * U.sin() * I.cos())) * x_cord;
        let b = ((-1.0_f64 * w.sin() * U.sin()) + (w.cos() * U.cos() * I.cos())) * y_cord;
        a + b
    };

    let z_ecl = {
        let a = (w.sin() * I.sin()) * x_cord;
        let b = (w.cos() * I.sin()) * y_cord;
        a + b
    };

    // 6. Equatorial coords in the "ICRF" or "J2000 frame"
    let obliquity = 23.43928_f64.to_radians();

    let x_eq = x_ecl;

    let y_eq = {
        let a = y_ecl * obliquity.cos();
        let b = z_ecl * obliquity.sin();
        a - b
    };

    let z_eq = {
        let a = y_ecl * obliquity.sin();
        let b = z_ecl * obliquity.cos();
        a + b
    };

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


pub fn get_eccentric_anomaly(e: f64, e_deg: f64, m: f64) -> f64 {

    // series convergence factor
    let tol = 10.0_f64.powi(-6);
    let mut delta_E = 0.0_f64;

    // Recommended starting point for faster convergence
    let mut current_E = m + (e_deg * m.to_radians().sin());

    // `m` is mean anomaly, e is eccentricity
    let mut count = 0;
    loop {
        let current_E_radians = current_E.to_radians();
        // DELTA M
        let delta_M = m - (current_E - (e_deg * current_E_radians.sin()));
        // DELTA E
        delta_E = delta_M / (1.0_f64 - (e * current_E_radians.cos()));
        // update current E to next term in series
        current_E = current_E + delta_E;

        if delta_E.abs() <= tol {
            break;
        }

        // Should never even be close
        if count > 100_000 {
            break;
        }
        count += 1;
    }

    current_E
}

