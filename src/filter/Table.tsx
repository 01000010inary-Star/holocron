import * as React from "react";

import { Orbit, columns} from "@/filter/Columns.tsx";
import { DataTable} from "@/filter/DataTable.tsx";

const data = [
    { id: "1", name: "Ryugu", type: "Cg", a: 1.190, e: 0.190, value: 82.76, profit: 30.08 },
    { id: "2", name: "Bennu", type: "B", a: 1.126, e: 0.203, value: 65.22, profit: 28.17 },
    { id: "3", name: "Eros", type: "S", a: 1.458, e: 0.223, value: 74.31, profit: 27.89 },
    { id: "4", name: "Didymos", type: "X", a: 1.644, e: 0.383, value: 91.15, profit: 35.25 },
    { id: "5", name: "Itokawa", type: "S", a: 1.324, e: 0.280, value: 76.12, profit: 29.45 },
    { id: "6", name: "Apophis", type: "Sq", a: 0.922, e: 0.191, value: 68.47, profit: 24.38 },
    { id: "7", name: "Pallas", type: "B", a: 2.772, e: 0.231, value: 109.28, profit: 40.22 },
    { id: "8", name: "Vesta", type: "V", a: 2.362, e: 0.089, value: 95.75, profit: 37.14 },
    { id: "9", name: "Ganymed", type: "S", a: 2.662, e: 0.232, value: 99.61, profit: 33.42 },
    { id: "10", name: "Hathor", type: "Q", a: 0.987, e: 0.449, value: 72.19, profit: 27.88 },
    { id: "11", name: "Orpheus", type: "C", a: 1.209, e: 0.323, value: 77.53, profit: 31.04 },
    { id: "12", name: "Icarus", type: "A", a: 1.078, e: 0.826, value: 88.62, profit: 34.87 },
    { id: "13", name: "Amor", type: "S", a: 1.919, e: 0.435, value: 84.16, profit: 32.11 },
    { id: "14", name: "Gaspra", type: "S", a: 2.210, e: 0.173, value: 91.98, profit: 36.20 },
    { id: "15", name: "Ida", type: "S", a: 2.861, e: 0.048, value: 100.27, profit: 38.75 },
    { id: "16", name: "Hermes", type: "Q", a: 1.655, e: 0.624, value: 86.54, profit: 32.67 },
    { id: "17", name: "Anteros", type: "A", a: 1.430, e: 0.255, value: 81.29, profit: 30.93 },
    { id: "18", name: "Toro", type: "S", a: 1.367, e: 0.435, value: 79.47, profit: 31.72 },
    { id: "19", name: "Toutatis", type: "S", a: 2.511, e: 0.629, value: 98.32, profit: 39.12 },
    { id: "20", name: "Castalia", type: "Q", a: 1.064, e: 0.483, value: 70.23, profit: 25.74 }
];
const Table: React.FC = () => {
    return (
        <div className="container mx-auto py-10 h-[400px] overflow-auto">
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default Table;
