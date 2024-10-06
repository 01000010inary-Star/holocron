import React, { useEffect, useState, createContext } from "react";
import initSqlJs, { Database } from "sql.js";

interface DatabaseContextType {
    db: Database | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
    undefined
);

interface ProviderProps {
    children: React.ReactNode;
}

const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {
    const [db, setDb] = useState<Database | null>(null);

    async function connectToDb() {
        const sqlPromise = initSqlJs({
            locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
        const dataPromise = fetch("holocron/data/holocron.db").then((res) =>
            res.arrayBuffer()
        );
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        const newDb = new SQL.Database(new Uint8Array(buf));
        setDb(newDb);
    }

    useEffect(() => {
        connectToDb();
    }, []);

    return (
        <DatabaseContext.Provider value={{ db }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export { DatabaseContext, DatabaseProvider };
