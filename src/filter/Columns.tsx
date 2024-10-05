import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Orbit = {
    id: string;
    name: string;
    type: string;
    a: number;
    e: number;
    value: number;
    profit: number;
};

export const columns: ColumnDef<Orbit>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "a",
        header: "Semi-major Axis",
    },
    {
        accessorKey: "e",
        header: "Eccentricity",
    },
    {
        accessorKey: "value",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Value ($B)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = parseFloat(row.getValue("value"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(value);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "profit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Profit ($B)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value = parseFloat(row.getValue("profit"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(value);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
];
