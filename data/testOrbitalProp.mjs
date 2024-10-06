import fs from "node:fs";

import('../orbital_propagator/pkg/orbital_propagator.js').then((wasm) => {
    const input = JSON.stringify([
        {
            id: 1,
            semi_major_axis: 1.0,
            eccentricity: 0.0167,
            inclination: 0.00005,
            longitude_asc_node: 348.73936,
            arg_perihelion: 114.20783,
            mean_anomaly: 357.51716,
            centuries_past_j2000: 0.21
        },
        {
            id: 2,
            semi_major_axis: 1.524,
            eccentricity: 0.0934,
            inclination: 1.850,
            longitude_asc_node: 49.57854,
            arg_perihelion: 286.502,
            mean_anomaly: 19.412,
            centuries_past_j2000: 0.21
        }
    ]);


    try {
        const result = wasm.get_coordinates(input);
        console.log("Result from WASM `get_coordinates()`");
        fs.writeFileSync("./public/data/coordinates.json", result);
        console.log("Wrote coordinates to ./public/data/coordinates.json");
    } catch (e) {
        console.error("Error calling WASM fn `get_coordinates`()");
        console.error(e);
        process.exit(1);
    }


    try {
        const res = wasm.get_orbit_paths(input);
        console.log("Result from WASM `get_orbit_paths()`");
        console.log(res);
    } catch (e) {
        console.error("Error calling WASM fn `get_orbit_paths()`");
        console.error(e);
        process.exit(1);
    }

}).catch((e) => {
    console.error("Error loading the WASM module:", e);
    process.exit(1);
});

