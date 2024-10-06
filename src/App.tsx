import React from "react";
import Orrery from "./orrery/Orrery";
import Filter from "@/filter/Filter.tsx";
import { DatabaseProvider } from "./contexts/DatabaseContext";

const App: React.FC = () => {
    return (
        <DatabaseProvider>
            <div>
                <Filter />
                <Orrery />
            </div>
        </DatabaseProvider>
    );
};

export default App;
