import { Html, OrbitControls } from "@react-three/drei";
import { useState, useContext, useEffect } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";
import PlanetType from "@/types/PlanetType";
import { Planet } from "../Planet";
import { OrbitalPropagatorContext } from "@/contexts/OrbitalPropagatorContext";

export function MainScene() {

    const { db } = useContext(DatabaseContext);
    const orbitalProp = useContext(OrbitalPropagatorContext);

    const [planets, setPlanets] = useState<PlanetType[]>([]);

    useEffect(() => {
        const res = db?.exec("select * from planet;");
        if (res && res.length > 0) {
            const resArr = res[0].values;
            const newPlanets = resArr.map((planet: PlanetType) => {
                return {
                    id: planet[0] as number,
                    name: planet[1] as string,
                    semi_major_axis_au: planet[2] as number,
                    semi_major_axis_au_century: planet[3] as number,
                    eccentricity_rad: planet[4] as number,
                    eccentricity_rad_century: planet[5] as number,
                    inclination_deg: planet[6] as number,
                    inclination_deg_century: planet[7] as number,
                    mean_longitude_deg: planet[8] as number,
                    mean_longitude_deg_century: planet[9] as number,
                    longitude_perihelion_deg: planet[10] as number,
                    longitude_perihelion_deg_century: planet[11] as number,
                    longitude_asc_node_deg: planet[12] as number,
                    longitude_asc_node_deg_century: planet[13] as number,
                };
            });
            setPlanets(newPlanets);
        }
    }, [db]);

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
            <OrbitControls />
        </>
    );
}
