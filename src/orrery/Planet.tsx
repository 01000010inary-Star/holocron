import { useContext, useEffect, useState } from "react";
import { OrbitalPropagatorContext } from "@/contexts/OrbitalPropagatorContext";
import PlanetType from "@/types/PlanetType";
import { Html } from "@react-three/drei";
import { Vector3, Color } from "three";
import { useModal } from "@ebay/nice-modal-react";
import { SelectedAsteroidDialog } from "./SelectedPlanetDialog";

interface PlanetProps {
    keplerian_elements: PlanetType;
    time: number;
}

interface SphereProps {
    position: Vector3;
    planetId: string;
    planetName: string;
}

const planetColors = { 
    Mercury: "#C840F5",   // pink
    Venus: "#FFC800",     // yellow-orange
    Earth: "#008000",     // green
    Mars: "#FF0000",      // red
    Jupiter: "#D2B48C",   // tan
    Saturn: "#FFFF00",    // yellow
    Uranus: "#7C40FF",    // purple
    Neptune: "#00BBFF"    // blue
};

function getPlanetColor(planetName: string): Color {
    const colorHex = planetColors[planetName as keyof typeof planetColors];
    return new Color(colorHex || "#FF0000"); // Default to white if planet not found
}

const PlanetSphere: React.FC<SphereProps> = ({ position, planetId, planetName }) => {
    const color = getPlanetColor(planetName);
  return (
    <mesh key={`sphere-${planetId}`} position={position}>
        {/* [Radius, Width segments, Height segments] | more segements = smoother */}
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial 
        // color="#00FFD0"
        color={color}
        transparent={true} 
        opacity={0.5} 
        wireframe={true}
      />
    </mesh>
  );
};

export const Planet: React.FC<PlanetProps> = ({ keplerian_elements, time }) => {
    const orbitalProp = useContext(OrbitalPropagatorContext);
    const { show, visible } = useModal(SelectedAsteroidDialog)

    const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));

    useEffect(() => {
        if (!orbitalProp?.ready) return;

        // Call wasm to set the position
        if (orbitalProp) {
            const inputBody = {
                ...keplerian_elements,
                julian_ephemeris_date: 0.0,
                centuries_past_j2000: 0.0,
                arg_perihelion: 0.0,
                mean_anomaly: 0.0,
            };
            const input = [inputBody];

            if (orbitalProp.get_coordinates) {
                try {
                    const cordRes = orbitalProp.get_coordinates(
                        JSON.stringify(input),
                        true
                    );
                    const coordinates = JSON.parse(cordRes);
                    // const x_cord = coordinates[0].x_orbital_plane;
                    // const y_cord = coordinates[0].y_orbital_plane;
                    // const z_cord = coordinates[0].z_orbital_plane;
                    // const x_cord = coordinates[0].x_ecliptic_plane;
                    // const y_cord = coordinates[0].y_ecliptic_plane;
                    // const z_cord = coordinates[0].z_ecliptic_plane;
                    const x_cord = coordinates[0].x_equatorial;
                    const y_cord = coordinates[0].y_equatorial;
                    const z_cord = coordinates[0].z_equatorial;

                    setPosition(new Vector3(x_cord, y_cord, z_cord));
                } catch (_e) {
                    console.error(
                        `Failure getting coordinates for ID: ${keplerian_elements.id} Name: ${keplerian_elements.name}`
                    );
                }
            }
            if (orbitalProp.get_orbit_paths) {
                try {
                    const orbitRes = orbitalProp.get_orbit_paths(
                        JSON.stringify(input),
                        true
                    );
                    const orbitPath = JSON.parse(orbitRes);
                    // TODO: Update with array for points on orbit path
                    console.log(`Orbit path for ${keplerian_elements.name}:`);
                    console.log(
                        "x_cords: " + JSON.stringify(orbitPath[0].x_cords)
                    );
                    console.log(
                        "y_cords: " + JSON.stringify(orbitPath[0].y_cords)
                    );
                    console.log(
                        "z_cords: " + JSON.stringify(orbitPath[0].z_cords)
                    );
                } catch (_e) {
                    console.error(
                        `Failure getting orbit path for ID: ${keplerian_elements.id} Name: ${keplerian_elements.name}`
                    );
                }
            }
        }
    }, [time, orbitalProp?.ready]);

    console.log("keplerian_elements", keplerian_elements);

    function handleOpenElementDetails(){
        show({
            name: keplerian_elements.name,
            eccentricityRad: keplerian_elements.eccentricity_rad,
            eccentricityRadCentury: keplerian_elements.eccentricity_rad_century,
            inclinationDeg: keplerian_elements.inclination_deg,
            inclinationDegCentury: keplerian_elements.inclination_deg_century,
            longitudeAscNodeDeg: keplerian_elements.longitude_asc_node_deg,
            longitudeAscNodeDegCentury: keplerian_elements.longitude_asc_node_deg_century,
            meanLongitudeDeg: keplerian_elements.mean_longitude_deg,
            meanLongitudeDegCentury: keplerian_elements.mean_longitude_deg_century,
            semiMajorAxisAu: keplerian_elements.semi_major_axis_au,
            onViewDetails: () => {},
        })
    }

    return (
        <>
        <Html position={position}>
            <div className="flex gappp-2 px-2 justify-end items-end group cursor-pointer" onClick={handleOpenElementDetails} style={{ opacity: visible ? 1 : 0.8 }}>
                    { /* <div className="w-5 h-5 border group-hover:border-white/90 border-white rounded-full" /> */}
                <span className="text-right px-4 text-white group-hover:text-white/90">
                    {keplerian_elements.name}
                </span>
            </div>
        </Html>
        <PlanetSphere position={position} planetId={`${keplerian_elements.id}`} planetName={keplerian_elements.name} />
        </>
    );
};
