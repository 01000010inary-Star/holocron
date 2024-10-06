import { OrbitalPropagatorContext } from "@/contexts/OrbitalPropagatorContext";
import PlanetType from "@/types/PlanetType";
import { Sphere } from "@react-three/drei";
import { useContext, useEffect, useState } from "react";
import { Vector3 } from "three";

interface PlanetProps {
    keplerian_elements: PlanetType;
    time: number;
}

export const Planet: React.FC<PlanetProps> = ({ keplerian_elements, time }) => {
    const orbitalProp = useContext(OrbitalPropagatorContext);

    const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));

    useEffect(() => {
        // Call wasm to set the position
        if (orbitalProp) {
            const inputBody = {
                ...keplerian_elements,
                julian_ephemeris_date: 0.0,
                centuries_past_j2000: 0.0,
                arg_perihelion: 0.0,
                mean_anomaly: 0.0,

            }
            const input = [inputBody];

            if (orbitalProp.get_coordinates) {
                try {
                    const cordRes = orbitalProp.get_coordinates(JSON.stringify(input), true);
                    const coordinates = JSON.parse(cordRes);
                    const x_cord = coordinates[0].x_orbital_plane;
                    const y_cord = coordinates[0].y_orbital_plane;
                    const z_cord = coordinates[0].z_orbital_plane;
                    setPosition(new Vector3(x_cord, y_cord, z_cord));

                } catch(e) {
                    console.error(`Failure getting coordinates for ID: ${keplerian_elements.id} Name: ${keplerian_elements.name}`);
                }
            }
            if (orbitalProp.get_orbit_paths) {
                try {
                    const orbitRes = orbitalProp.get_orbit_paths(JSON.stringify(input), true);
                    const orbitPath = JSON.parse(orbitRes);
                    // TODO: Update with array for points on orbit path
                    console.log(`Orbit path for ${keplerian_elements.name}:`);
                    console.log("x_cords: " + JSON.stringify(orbitPath[0].x_cords));
                    console.log("y_cords: " + JSON.stringify(orbitPath[0].y_cords));
                    console.log("z_cords: " + JSON.stringify(orbitPath[0].z_cords));
                } catch(e) {
                    console.error(`Failure getting orbit path for ID: ${keplerian_elements.id} Name: ${keplerian_elements.name}`);
                }
            }
        }
    }, [time]);

    return (
        <Sphere args={[0.05, 32, 32]} position={position}>
            <meshStandardMaterial attach="material" color="red" />
        </Sphere>
    );
};
