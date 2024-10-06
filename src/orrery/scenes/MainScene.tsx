import { OrbitControls } from "@react-three/drei";
import { useState, useContext, useEffect } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";
import PlanetType from "@/types/PlanetType";
import { Planet } from "../Planet";

export function MainScene() {
    const db = useContext(DatabaseContext);

    const [planets, setPlanets] = useState<PlanetType[]>([]);

    useEffect(() => {
        const res = db?.db?.exec("select * from planet;");
        if (res && res.length > 0) {
            const resArr = res[0].values;
            const newPlanets = resArr.map((planet) => {
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

    return (
        <>
            <ambientLight intensity={2} />
            <pointLight position={[10, 10, 10]} />
            {planets.map((planet) => (
                <Planet key={planet.id} keplerian_elements={planet} time={0} />
            ))}
            <OrbitControls />
        </>
    );
}
