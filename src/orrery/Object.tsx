import React, { useEffect, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

const Object: React.FC = () => {
    const earth = useLoader(TextureLoader, "textures/ear0xuu2.jpg");
    const earthRef = useRef<Mesh>(null);

    useFrame(() => {
        earthRef.current?.rotateY(Math.PI / 180);
    });

    return (
        <mesh ref={earthRef} position={[-5, 0, 0]} scale={1}>
            <sphereGeometry args={[2, 25, 25]} />
            <meshStandardMaterial map={earth} />
        </mesh>
    );
};

export default Object;
