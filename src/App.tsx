import React from "react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import Results from "@/filter/Results.tsx";

const App: React.FC = () => {
    return (
        <div>
            <Filter />
            <Results />
            <Orrery />
        </div>
    );
};

export default App;
