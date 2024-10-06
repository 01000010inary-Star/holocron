import { Coordinates } from "./coordinates.js";

const INITIAL_COORDINATES = [
    {
        id: 1,
        semi_major_axis: 1.0,
        eccentricity: 0.0167,
        inclination: 0.00005,
        longitude_asc_node: 348.73936,
        arg_perihelion: 114.20783,
        mean_anomaly: 357.51716,
        centuries_past_j2000: 0.21,
    },
    {
        id: 2,
        semi_major_axis: 1.524,
        eccentricity: 0.0934,
        inclination: 1.85,
        longitude_asc_node: 49.57854,
        arg_perihelion: 286.502,
        mean_anomaly: 19.412,
        centuries_past_j2000: 0.21,
    },
];

export async function getCoordinates(newCoordinates = INITIAL_COORDINATES) {
    const wasm = await import(
        "../../orbital_propagator/pkg/orbital_propagator.js"
    );
    const coordinates: Coordinates[] = JSON.parse(
        wasm.get_coordinates(JSON.stringify(newCoordinates))
    );

    return coordinates;
}
