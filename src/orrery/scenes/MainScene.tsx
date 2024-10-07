import { Html, OrbitControls } from "@react-three/drei";
import { useState, useContext, useEffect, useMemo } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";
import PlanetType from "@/types/PlanetType";
import { Planet } from "../Planet";
import { OrbitalPropagatorContext } from "@/contexts/OrbitalPropagatorContext";
import { Vector3, BufferGeometry, SphereGeometry } from "three";

export function MainScene() {
    const databaseConnection = useContext(DatabaseContext);
    const orbitalProp = useContext(OrbitalPropagatorContext);

    const [planets, setPlanets] = useState<PlanetType[]>([]);

    useEffect(() => {
        const res = databaseConnection?.db?.exec("select * from planet;");
        if (res && res.length > 0) {
            const resArr = res[0].values;
            const newPlanets = resArr.map((planet: any) => {
                return {
                    id: planet[0],
                    name: planet[1],
                    semi_major_axis_au: planet[2],
                    semi_major_axis_au_century: planet[3],
                    eccentricity_rad: planet[4],
                    eccentricity_rad_century: planet[5],
                    inclination_deg: planet[6],
                    inclination_deg_century: planet[7],
                    mean_longitude_deg: planet[8],
                    mean_longitude_deg_century: planet[9],
                    longitude_perihelion_deg: planet[10],
                    longitude_perihelion_deg_century: planet[11],
                    longitude_asc_node_deg: planet[12],
                    longitude_asc_node_deg_century: planet[13],
                };
            });
            setPlanets(newPlanets);
        }
    }, [databaseConnection?.db]);


    const orbitPaths = useMemo(() => {

        if (!orbitalProp || !orbitalProp.ready || !orbitalProp.get_orbit_paths) {
            return null;
        }

        try {
            const paths: React.ReactElement[] = [];

            planets.forEach((planet) => {
                // has to be in array for wasm fn
                const inputBody = {
                    // ...keplerian_elements,
                    ...planet,
                    julian_ephemeris_date: 0.0,
                    centuries_past_j2000: 0.0,
                    arg_perihelion: 0.0,
                    mean_anomaly: 0.0,
                };
                const input = [inputBody];

                var orbitPathRes = "{}";

                if (orbitalProp.get_orbit_paths) {
                    // stringified data, boolean for is_planet
                    orbitPathRes = orbitalProp.get_orbit_paths(
                        JSON.stringify(input),
                        true
                    );
                }
                const orbitPath = JSON.parse(orbitPathRes);

                const x_cords = orbitPath[0].x_cords;
                const y_cords = orbitPath[0].y_cords;
                const z_cords = orbitPath[0].z_cords;

                const points = x_cords.map((x: any, index: any) => (
                    new Vector3(x, y_cords[index], z_cords[index])
                ));


                // White line orbit path
                const lineGeometry = new BufferGeometry().setFromPoints(points);
                paths.push(
                    <line key={`orbit-${planet.id}`}>
                        <primitive attach="geometry" object={lineGeometry} />
                        <lineBasicMaterial color="white" />
                    </line>
                );

                // Transparent sphere around orbit path
                // avg position for center of sphere
                const center = new Vector3(
                    x_cords.reduce((acc: any, val: any) => acc + val, 0) / x_cords.length,
                    y_cords.reduce((acc: any, val: any) => acc + val, 0) / y_cords.length,
                    z_cords.reduce((acc: any, val: any) => acc + val, 0) / z_cords.length
                );

                // radius of sphere (roughly average distance from center to each point)
                const radius = points.reduce((acc: any, point: any) => {
                    return acc + center.distanceTo(point);
                }, 0) / points.length;

                const sphereGeometry = new SphereGeometry(radius, 32, 32);
                paths.push(
                    <mesh key={`sphere-${planet.id}`} position={center}>
                        <primitive attach="geometry" object={sphereGeometry} />
                        <meshStandardMaterial 
                            color="blue" 
                            transparent={true} 
                            opacity={0.1} 
                            wireframe={true}
                        />
                    </mesh>
                );
            });

            return paths;

        } catch(e) {
            console.error("Failure generating orbit paths");
            return null;
        }

    }, [orbitalProp?.ready, JSON.stringify(planets)]);

    if (!orbitalProp?.ready) {
        return (
            <Html
                position={[0, 0, 0]}
                className="flex gap-2 group cursor-pointer bg-background"
            >
                <h1 className="text-md">Loading...</h1>
            </Html>
        );
    }

    return (
        <>
            <ambientLight intensity={2} />
            <Html
                position={[0, 0, 0]}
                className="flex gap-2 group cursor-pointer"
            >
                <div className="w-5 h-5 border group-hover:border-white/90 border-yellow-200/50 bg-sun rounded-full" />
                <span className="text-white group-hover:text-white/90">
                    Sun
                </span>
            </Html>
            {planets.map((planet) => (
                <Planet key={planet.id} keplerian_elements={planet} time={0} />
            ))}
            {orbitPaths}
            <OrbitControls />
        </>
    );
}
