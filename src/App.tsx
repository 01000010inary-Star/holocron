import React from "react";
import Orrery from "./orrery/Orrery";
import { DatabaseProvider } from "./contexts/DatabaseContext";

const App: React.FC = () => {
    return (
        <DatabaseProvider>
            <div>
                <Orrery />
            </div>
        </DatabaseProvider>
    );
};

export default App;
