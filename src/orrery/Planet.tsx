import { Sphere } from "@react-three/drei";
import type { Vector3 } from "@react-three/fiber";

interface PlanetProps {
    position: Vector3 | undefined;
}

export const Planet: React.FC<PlanetProps> = ({ position }) => {
    return (
        <Sphere args={[0.05, 32, 32]} position={position}>
            <meshStandardMaterial attach="material" color="red" />
        </Sphere>
    );
};

