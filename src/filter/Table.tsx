import * as React from "react";

import { columns } from "@/filter/Columns.tsx";
import { DataTable } from "@/filter/DataTable.tsx";
import { useContext } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext.tsx";
import { Label } from "@/components";

const Table: React.FC = () => {
    const databaseConnection = useContext(DatabaseContext);

    return (
        <div className="mx-auto py-10 w-full">
            <Label>{databaseConnection?.filteredDb.length} Items</Label>
            <div className=" h-[400px] overflow-auto">
                <DataTable columns={columns} data={databaseConnection?.filteredDb ?? []} />
            </div>
        </div>
    );
};

export default Table;
