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
    }, [time]);

    return (
        <Sphere args={[0.05, 32, 32]} position={position}>
            <meshStandardMaterial attach="material" color="red" />
        </Sphere>
    );
};
