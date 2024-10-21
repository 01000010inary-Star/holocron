import React from "react";
import { Provider as NiceReactModal } from "@ebay/nice-modal-react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Results from "@/filter/Results.tsx";
import { OrbitalPropagatorProvider } from "./contexts/OrbitalPropagatorContext";
import pic from "../public/textures/star_galaxy.png";

const App: React.FC = () => {
    return (
        <OrbitalPropagatorProvider>
            <DatabaseProvider>
                <NiceReactModal>
                    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${pic})` }}>
                        <div className="absolute inset-0 bg-black opacity-70"/>
                        <div className="relative">
                        <Filter />
                        <Results />
                        <Orrery />
                        </div>
                    </div>
                </NiceReactModal>
            </DatabaseProvider>
        </OrbitalPropagatorProvider>
    );
};

export default App;
