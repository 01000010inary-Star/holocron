import { Canvas } from "@react-three/fiber";
import { MainScene } from "./scenes/MainScene";

const Orrery: React.FC = () => {
    return (
        <Canvas className="w-screen h-screen absolute block top-0 left-0 overflow-hidden" style={{ width: "100vw", height: "100vh" }}>
            <MainScene />
        </Canvas>
    );
};

export default Orrery;
