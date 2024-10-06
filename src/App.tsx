import React from "react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Results from "@/filter/Results.tsx";

const App: React.FC = () => {
    return (
        <DatabaseProvider>
            <div>
                <Filter />
                <Results />
                <Orrery />
            </div>
        </DatabaseProvider>
    );
};

export default App;
