import React from "react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Results from "@/filter/Results.tsx";
import { OrbitalPropagatorProvider } from "./contexts/OrbitalPropagatorContext";

const App: React.FC = () => {
    return (
        <OrbitalPropagatorProvider>
            <DatabaseProvider>
                <div>
                    <Filter />
                    <Results />
                    <Orrery />
                </div>
            </DatabaseProvider>
        </OrbitalPropagatorProvider>
    );
};

export default App;
