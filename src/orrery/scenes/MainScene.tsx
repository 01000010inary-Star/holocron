import { Html, OrbitControls } from "@react-three/drei";
import { useState, useContext, useEffect, useMemo } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";
import PlanetType from "@/types/PlanetType";
import { Planet } from "../Planet";
import { OrbitalPropagatorContext } from "@/contexts/OrbitalPropagatorContext";
import { Vector3, BufferGeometry, SphereGeometry, Color } from "three";
import MERCURY from "../../../public/textures/Mercury.jpg";
import VENUS from "../../../public/textures/Venus.jpg";
import EARTH from "../../../public/textures/Earth.jpg";
import MARS from "../../../public/textures/Mars.jpg";
import JUPITER from "../../../public/textures/Jupiter.jpg";
import SATURN from "../../../public/textures/Saturn.jpg";
import URANUS from "../../../public/textures/Uranus.jpg";
import NEPTUNE from "../../../public/textures/Neptune.jpg";

const planetData = {
  Mercury: { color: "#C840F5", texture: MERCURY },
  Venus: { color: "#FFC800", texture: VENUS },
  Earth: { color: "#008000", texture: EARTH },
  Mars: { color: "#FF0000", texture: MARS },
  Jupiter: { color: "#D2B48C", texture: JUPITER },
  Saturn: { color: "#FFFF00", texture: SATURN },
  Uranus: { color: "#7C40FF", texture: URANUS },
  Neptune: { color: "#00BBFF", texture: NEPTUNE },
};

const getPlanetStyles = (planetName: string) => {
    const planetInfo = planetData[planetName as keyof typeof planetData];

    // Default values if planet not found
    if (!planetInfo) {
        return {
            // Default grey & no texture
            color: new Color("#D6D6D6"),
            texture: null
        };
    }

    return {
        color: new Color(planetInfo.color),
        texture: planetInfo.texture,
    };
}

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


                // colored line orbit path
                const lineGeometry = new BufferGeometry().setFromPoints(points);
                paths.push(
                    <line key={`orbit-${planet.id}`}>
                        <primitive attach="geometry" object={lineGeometry} />
                        <lineBasicMaterial 
                            // color="white"
                            color={getPlanetStyles(planet.name).color}
                            transparent={true}
                            opacity={0.2}
                        />
                    </line>
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
            <ambientLight intensity={10} />
            <Html
                position={[0, 0, 0]}
                className="flex gap-2 group cursor-pointer"
            >
                <div className="w-5 h-5 border group-hover:border-white/90 border-yellow-200/50 bg-sun rounded-full" />
                <span className="text-white group-hover:text-white/90">
                    Sun
                </span>
            </Html>
            {planets.map((planet) => {
                const {color, texture} = getPlanetStyles(planet.name);
                return (
                    <Planet key={planet.id} keplerian_elements={planet} time={0} planetColor={color} planetTextureUrl={texture} />
                )
            })}
            {orbitPaths}
            <OrbitControls />
        </>
    );
}
