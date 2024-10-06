import React, { useContext } from "react";
import { Canvas } from "@react-three/fiber";
import Object from "./Object";
import { DatabaseContext } from "@/contexts/DatabaseContext";

const Orrery: React.FC = () => {
    const db = useContext(DatabaseContext);

    console.log(db?.db?.exec("select count(*) from small_body;"));

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
