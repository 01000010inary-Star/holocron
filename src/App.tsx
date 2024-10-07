import React from "react";
import { Provider as NiceReactModal } from "@ebay/nice-modal-react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Results from "@/filter/Results.tsx";
import { OrbitalPropagatorProvider } from "./contexts/OrbitalPropagatorContext";

const App: React.FC = () => {
    return (
        <OrbitalPropagatorProvider>
            <DatabaseProvider>
                <NiceReactModal>
                    <div>
                        <Filter />
                        <Results />
                        <Orrery />
                    </div>
                </NiceReactModal>
            </DatabaseProvider>
        </OrbitalPropagatorProvider>
    );
};

export default App;
