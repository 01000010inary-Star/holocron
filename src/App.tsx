import React from "react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Results from "@/filter/Results.tsx";
import { OrbitPropagatorProvider } from "./orrery/OrbitPropagatorContext";

const App: React.FC = () => {
    return (
        <OrbitPropagatorProvider>
            <DatabaseProvider>
                <div>
                    <Filter />
                    <Results />
                    <Orrery />
                </div>
            </DatabaseProvider>
        </OrbitPropagatorProvider>
    );
};

export default App;
