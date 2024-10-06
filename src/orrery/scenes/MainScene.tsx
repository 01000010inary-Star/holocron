import { useRef } from "react";
import { useOrbitPropagator } from "../OrbitPropagatorContext";
import { useFrame } from "@react-three/fiber";
import { getCoordinates } from "../get-coordinates";
import { OrbitControls } from "@react-three/drei";
import { Planet } from "../Planet";
import Object from "../Object";

export function MainScene() {
    const { planets, handleSetPlanets } = useOrbitPropagator();
    const clock = useRef(0);

    useFrame((state, delta) => {
        async function simulateUpdatedPosition() {
            clock.current += delta;
            const coordinates = await getCoordinates();
            handleSetPlanets(coordinates);
        }

        simulateUpdatedPosition();
    });

    return (
        <>
            <ambientLight intensity={2} />
            <pointLight position={[10, 10, 10]} />

            <Object />
            {planets.map((planet) => (
                <Planet
                    key={planet.id}
                    position={[
                        planet.x_equatorial,
                        planet.y_equatorial,
                        planet.z_equatorial,
                    ]}
                />
            ))}

            <OrbitControls />
        </>
    );
}
