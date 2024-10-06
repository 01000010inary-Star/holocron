import React, { useEffect, useState, createContext } from "react";
import initSqlJs, { Database } from "sql.js";
import { Orbit } from "@/filter/Columns.tsx";

interface DatabaseContextType {
    db: Database | null;
    filteredDb: Orbit[];
    updateFilteredDb: (newData: Orbit[]) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
    undefined
);

interface ProviderProps {
    children: React.ReactNode;
}

const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {
    const [db, setDb] = useState<Database | null>(null);
    const [filteredDb, setFilteredDb] = useState<>([]);

    async function connectToDb() {
        const sqlPromise = initSqlJs({
            locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
        const dataPromise = fetch("/data/holocron.db").then((res) =>
            res.arrayBuffer()
        );
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        const newDb = new SQL.Database(new Uint8Array(buf));
        setDb(newDb);
    }

    function DbToJSON(database: Database) {
        const res = database?.exec("select * from small_body;");
        if (res && res.length > 0) {
            const resArr = res[0].values;
            const newSmallBody = resArr.map((body) => {
                return {
                    id: body[0] as number,
                    primary_designation: body[1] as string,
                    semi_major_axis: body[2] as number,
                    eccentricity: body[3] as number,
                    inclination: body[4] as number,
                    mean_anomaly: body[7] as number,
                    period: body[8] as number,
                    orbit_class: body[11] as string,
                    date_first_obs: body[12] as Date,
                    date_last_obs: body[13] as Date,
                };
            });
            console.log("Updated Filter DB");
            setFilteredDb(newSmallBody);
        }
    }

    // Function to update the filteredDb from other components
    const updateFilteredDb = (newData: Orbit[]) => {
        setFilteredDb(newData);
    };

    // Effect to connect to the database when the component mounts
    useEffect(() => {
        const initializeDb = async () => {
            await connectToDb(); // Connect to the database
        };
        initializeDb();
    }, []);

    // Effect to convert the database data into JSON after `db` is initialized
    useEffect(() => {
        if (db) {
            DbToJSON(db); // Call DbToJSON once the database is set
        }
    }, [db]); // Trigger only when db is set

    return (
        <DatabaseContext.Provider value={{ db, filteredDb, updateFilteredDb }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export { DatabaseContext, DatabaseProvider };
