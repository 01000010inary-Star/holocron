import React from "react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";

const App: React.FC = () => {
    return (
        <div>
            <Filter />
            <Orrery />
        </div>
    );
};

export default App;
