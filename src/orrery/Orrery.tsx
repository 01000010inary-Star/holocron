import { Canvas } from "@react-three/fiber";
import { MainScene } from "./scenes/MainScene";
import { Scene } from "three";

const Orrery: React.FC = () => {
    const mainScene = new Scene();

    return (
        <Canvas
            className="w-screen h-screen absolute block top-0 left-0 overflow-hidden"
            style={{ width: "100vw", height: "100vh" }}
            scene={mainScene}
        >
            <MainScene />
        </Canvas>
    );
};

export default Orrery;
