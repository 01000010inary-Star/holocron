import React from "react";
import { Canvas } from "@react-three/fiber";
import Object from "./Object";

const Orrery: React.FC = () => {
    return (
        <Canvas>
            <ambientLight intensity={2} />
            <Object />
            <mesh position={[5, 0, 0]} scale={1}>
                <sphereGeometry args={[2, 25, 25]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        </Canvas>
    );
};

export default Orrery;
