import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Values for Checkboxes in the filter pane
const items = [
    { id: "c", label: "C-type (Carbonaceous)" },
    { id: "s", label: "S-type (Silicaceous or Stony)" },
    { id: "m", label: "M-type (Metallic)" },
    { id: "p", label: "P-type (Primitive)" },
    { id: "d", label: "D-type (Organic Rich)" },
    { id: "q", label: "Q-type (Basaltic)" },
    { id: "r", label: "R-type (Rare, Silicaceous)" },
    { id: "v", label: "V-type (Vestoids)" },
    { id: "e", label: "E-type (Enstatite-rich)" },
    { id: "b", label: "B-type (B-type Carbonaceous)" },
] as const;

const Filter: React.FC = () => {
    // State to track slider values
    const [value, setValue] = useState<[number, number]>([4000000, 12000000]);
    const [profit, setProfit] = useState<[number, number]>([2000000, 8000000]);
    const [mass, setMass] = useState<[number, number]>([1, 15]);

    // State to track selected checkboxes (composition types)
    const [selectedCompositions, setSelectedCompositions] = useState<string[]>(
        []
    );

    // Handle checkbox change
    const handleCheckboxChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedCompositions([...selectedCompositions, id]);
        } else {
            setSelectedCompositions(
                selectedCompositions.filter((item) => item !== id)
            );
        }
    };

    return (
        <div className=" absolute top-10 left-10 p-4 z-10">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Filter Objects</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filter Objects</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Value Slider */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                                Value
                            </Label>
                            <div className="col-span-3 relative">
                                {/* Display Min and Max values */}
                                <div className="absolute top-0 left-0 text-sm">
                                    {`Min: ${value[0]}`}
                                </div>
                                <div className="absolute top-0 right-0 text-sm">
                                    {`Max: ${value[1]}`}
                                </div>
                                <Slider
                                    id="value"
                                    value={value}
                                    max={8000000}
                                    step={500000}
                                    minStepsBetweenThumbs={2}
                                    className="col-span-3 mt-6"
                                    onValueChange={(val) =>
                                        setValue(val as [number, number])
                                    }
                                />
                            </div>
                        </div>
                        {/* Profit Slider */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Profit
                            </Label>
                            <div className="col-span-3 relative">
                                {/* Display Min and Max values */}
                                <div className="absolute top-0 left-0 text-sm">
                                    {`Min: ${profit[0]}`}
                                </div>
                                <div className="absolute top-0 right-0 text-sm">
                                    {`Max: ${profit[1]}`}
                                </div>
                                <Slider
                                    id="profit"
                                    value={profit}
                                    max={8000000}
                                    step={500000}
                                    minStepsBetweenThumbs={2}
                                    className="col-span-3 mt-6"
                                    onValueChange={(val) =>
                                        setProfit(val as [number, number])
                                    }
                                />
                            </div>
                        </div>
                        {/* Mass Slider */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Mass
                            </Label>
                            <div className="col-span-3 relative">
                                {/* Display Min and Max values */}
                                <div className="absolute top-0 left-0 text-sm">
                                    {`Min: ${mass[0]}EM`}
                                </div>
                                <div className="absolute top-0 right-0 text-sm">
                                    {`Max: ${mass[1]}EM`}
                                </div>
                                <Slider
                                    id="mass"
                                    value={mass}
                                    max={50}
                                    step={1}
                                    minStepsBetweenThumbs={1}
                                    className="col-span-3 mt-6"
                                    onValueChange={(val) =>
                                        setMass(val as [number, number])
                                    }
                                />
                            </div>
                        </div>
                        {/* Composition Checkboxes */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="composition" className="text-right">
                                Composition
                            </Label>
                            <div className="col-span-3 grid grid-cols-1 gap-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            checked={selectedCompositions.includes(
                                                item.id
                                            )} // Controlled by state
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(
                                                    item.id,
                                                    checked
                                                )
                                            } // Update state
                                        />
                                        <Label>{item.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                onClick={() =>
                                    console.log({
                                        value,
                                        profit,
                                        mass,
                                        selectedCompositions,
                                    })
                                }
                            >
                                Show Results
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Filter;
