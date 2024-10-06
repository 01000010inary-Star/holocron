#![allow(unused_imports, non_snake_case)]
use std::f64;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string, Value};
use std::f64::consts::{E, PI};


// create table keplerian_element (
//   id                  integer primary key,
//   semi_major_axis     real    not null,
//   eccentricity        real    not null,
//   inclination         real    not null,
//   longitude_asc_node  real    not null,
//   arg_perihelion      real    not null,
//   mean_anomaly        real    not null,
//   // centuries past J2000.0
//   timestamp     real 
// );


#[derive(Serialize, Deserialize, Debug)]
pub struct InputBody {
    id: u32,
    /// a
    semi_major_axis: f64,
    /// e
    eccentricity: f64,
    /// i
    inclination: f64,
    /// om
    longitude_asc_node: f64,
    /// w
    arg_perihelion: f64,
    mean_anomaly: f64,
    centuries_past_j2000: f64,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct OutputBody {
    id: u32,
    x_orbital_plane: f64,
    y_orbital_plane: f64,
    z_orbital_plane: f64,

    x_ecliptic_plane: f64,
    y_ecliptic_plane: f64,
    z_ecliptic_plane: f64,

    x_equatorial: f64,
    y_equatorial: f64,
    z_equatorial: f64
}

impl OutputBody {
    pub fn default_with_id(id: u32) -> Self {
        Self {
            id,
            ..Self::default()
        }
    }
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

    println!("Loop finished running: {}x", count);
    println!("New delta_E.abs():     {}", delta_E.abs());

    current_E

}


pub fn get_cords(val: &InputBody, out: &mut OutputBody) -> () {

    // AU
    let a = val.semi_major_axis;
    // ?
    let e = val.eccentricity;
    let e_deg = 180.0_f64 / PI * e;
    // Degrees
    let I = val.inclination.to_radians();

    // Degrees
    let mut w = val.arg_perihelion;
    let U = val.longitude_asc_node.to_radians();

    // 3. Normalize mean anomaly into -180deg <= M <= 180deg
    let mut m = val.mean_anomaly % 360.0;
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

    // println!("x: {}", x_cord);
    // println!("y: {}", y_cord);
    // println!("z: {}", z_cord);
    // println!("---");
    // println!("x_ecl: {}", x_ecl);
    // println!("y_ecl: {}", y_ecl);
    // println!("z_ecl: {}", z_ecl);
    // println!("---");
    // println!("x_eq: {}", x_eq);
    // println!("y_eq: {}", y_eq);
    // println!("z_eq: {}", z_eq);

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

impl InputBody {
    pub fn into_has_cords(&self) -> OutputBody {
        let mut out = OutputBody::default_with_id(self.id);
        get_cords(self, &mut out);
        out
    }
}

#[wasm_bindgen]
pub fn get_coordinates(input: &str) -> Result<String, JsValue> {

    let input_bodies: Vec<InputBody> = from_str(input)
        .map_err(|e| JsValue::from_str(&format!("Failure parsing bodies into structured type: {}", e)))?;


    let output_bodies: Vec<OutputBody> = input_bodies
        .into_iter()
        .map(|body| {
            body.into_has_cords()
        })
        .collect();

    to_string(&output_bodies)
        .map_err(|e| JsValue::from_str(&format!(" err : {}", e)))

}


#[cfg(test)]
mod tests {
    use super::*;

    fn get_test_body() -> InputBody {

        let mars = InputBody {
            id: 4,
            // AU
            semi_major_axis: 1.523679,
            eccentricity: 0.0934,
            inclination: 1.850_f64,
            longitude_asc_node: 49.558_f64,
            arg_perihelion: 286.502_f64,
            mean_anomaly: 19.373_f64,
            // ?? not used in calc yet
            centuries_past_j2000: 0.0,
        };

        mars
    }

    #[test]
    fn test_input() {

        // let a = get_test_body();
        // let b = a.into_has_cords();
        // let seq: Vec<f64> = (0..80)
        //     .map(|i| {
        //         -PI + 2.0 * PI * (i as f64) / 79.0
        //     })
        //     .collect();
        //
        // for n in seq.into_iter() {
        //     println!("Val: {}", n);
        // }

        
    }

    // #[test]
    // fn it_works() {
    //     let result = add(2, 2);
    //     assert_eq!(result, 4);
    // }
}


// pub fn get_orbit_path(val: InputAsteroid) -> () {
//     // semi-minor-axis
//     let semi_minor_axis = val.semi_major_axis * f64::sqrt(1.0 - val.eccentricity.powi(2));
//     let dist_center_to_focus = val.eccentricity * val.semi_major_axis;
//
//     let mut x_cord: f64 = dist_center_to_focus * -1.0;
//     let mut y_cord: f64 = 0.0;
//     let mut z_cord: f64 = 0.0;
//
//     // vec of evenly spaced floats between -pi/pi
//     // [-pi, (-pi + step), (-pi + (step * 2)), (-pi + (step * 3)), ...]
//     let seq: Vec<f64> = (0..80)
//         .map(|i| {
//             -PI + 2.0 * PI * (i as f64) / 79.0
//         })
//         .collect();
// }
//
