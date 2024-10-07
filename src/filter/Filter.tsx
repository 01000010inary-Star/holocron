import { useContext, useEffect, useState } from "react";
import { AlertDialog, Button, Slider, Label } from "@/components/ui";
import { DatabaseContext } from "@/contexts/DatabaseContext.tsx";
import { Input } from "@/components/ui/input.tsx";
import { SmallBodyType } from "@/types/SmallBodyType";

const Filter: React.FC = () => {
    const [primaryDesignation, setPrimaryDesignation] = useState<string>("");
    const [semiMajorAxis, setSemiMajorAxis] = useState<[number, number]>([
        0.0, 360.0,
    ]);
    const [eccentricity, setEccentricity] = useState<[number, number]>([
        0.0, 1.0,
    ]);
    const [inclination, setInclination] = useState<[number, number]>([
        0.0, 180.0,
    ]);

    // Use Context to access db and filteredDb
    const databaseConnection = useContext(DatabaseContext);
    const [smallBody, setSmallBody] = useState<SmallBodyType[]>([]);

    useEffect(() => {
        const res = databaseConnection?.db?.exec("select * from small_body;");
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
                    date_first_obs: new Date(body[12]?.toString()!),
                    date_last_obs: new Date(body[13]?.toString()!),
                };
            });
            setSmallBody(newSmallBody);
        }
    }, [databaseConnection?.db]);

    // Handle the filter logic
    // const applyFilters = () => {
    //     // Start with the full data
    //     let filtered = smallBody;
    //     console.log("Current Filter Values:");
    //     console.log("Primary Designation:", primaryDesignation);
    //     console.log("Semi-Major Axis:", semiMajorAxis);
    //     console.log("Eccentricity:", eccentricity);
    //     console.log("Inclination:", inclination);

    //     // Apply filters only if values are provided
    //     if (primaryDesignation) {
    //         filtered = filtered.filter((item) =>
    //             item.primary_designation
    //                 .toLowerCase()
    //                 .includes(primaryDesignation.toLowerCase())
    //         );
    //     }
    //     if (semiMajorAxis !== "") {
    //         filtered = filtered.filter(
    //             (item) =>
    //                 item.semi_major_axis >= Number(semiMajorAxis[0]) &&
    //                 item.semi_major_axis <= Number(semiMajorAxis[1])
    //         );
    //     }
    //     if (eccentricity !== "") {
    //         filtered = filtered.filter((item) => {
    //             const eccentricityValue = parseFloat(
    //                 item.eccentricity.toFixed(6)
    //             ); // Round to avoid floating-point errors
    //             return (
    //                 eccentricityValue >= eccentricity[0] &&
    //                 eccentricityValue <= eccentricity[1]
    //             );
    //         });
    //     }
    //     if (inclination !== "") {
    //         filtered = filtered.filter((item) => {
    //             const inclinationValue = parseFloat(
    //                 item.inclination.toFixed(6)
    //             ); // Round to avoid floating-point errors
    //             return (
    //                 inclinationValue >= inclination[0] &&
    //                 inclinationValue <= inclination[1]
    //             );
    //         });
    //     }

    //     // Update the filteredDb in the context
    //     updateFilteredDb(filtered);
    // };

    return (
        <div className="absolute top-10 left-10 p-4 z-10">
            <AlertDialog>
                <AlertDialog.Trigger asChild>
                    <Button variant="outline">Filter Objects</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content className="sm:max-w-[425px]">
                    <AlertDialog.Header>
                        <AlertDialog.Title>Filter Objects</AlertDialog.Title>
                        <AlertDialog.Description></AlertDialog.Description>
                    </AlertDialog.Header>
                    <div className="grid gap-4 py-4">
                        {/* Primary Designation Search Bar */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                                Primary Designation
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    type="text"
                                    value={primaryDesignation}
                                    onChange={(e) =>
                                        setPrimaryDesignation(e.target.value)
                                    }
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                        {/* Semi Major Axis Slider */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Semi-Major Axis
                            </Label>
                            <div className="col-span-3 relative">
                                {/* Display Min and Max values */}
                                <div className="absolute top-0 left-0 text-sm">
                                    {`Min: ${semiMajorAxis[0]}`}
                                </div>
                                <div className="absolute top-0 right-0 text-sm">
                                    {`Max: ${semiMajorAxis[1]}`}
                                </div>
                                <Slider
                                    id="semi-major-axis"
                                    value={semiMajorAxis}
                                    max={360.0}
                                    step={1}
                                    minStepsBetweenThumbs={2}
                                    className="col-span-3 mt-6"
                                    onValueChange={(val) =>
                                        setSemiMajorAxis(
                                            val as [number, number]
                                        )
                                    }
                                />
                            </div>
                        </div>
                        {/* Eccentricity Slider */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Eccentricity
                            </Label>
                            <div className="col-span-3 relative">
                                {/* Display Min and Max values */}
                                <div className="absolute top-0 left-0 text-sm">
                                    {`Min: ${eccentricity[0]}`}
                                </div>
                                <div className="absolute top-0 right-0 text-sm">
                                    {`Max: ${eccentricity[1]}`}
                                </div>
                                <Slider
                                    id="eccentricity"
                                    value={eccentricity}
                                    max={1.0}
                                    step={0.1}
                                    minStepsBetweenThumbs={1}
                                    className="col-span-3 mt-6"
                                    onValueChange={(val) =>
                                        setEccentricity(val as [number, number])
                                    }
                                />
                            </div>
                        </div>
                        {/* Inclination Slider */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Inclination
                            </Label>
                            <div className="col-span-3 relative">
                                {/* Display Min and Max values */}
                                <div className="absolute top-0 left-0 text-sm">
                                    {`Min: ${inclination[0]}`}
                                </div>
                                <div className="absolute top-0 right-0 text-sm">
                                    {`Max: ${inclination[1]}`}
                                </div>
                                <Slider
                                    id="inclination"
                                    value={inclination}
                                    max={180}
                                    step={1}
                                    minStepsBetweenThumbs={1}
                                    className="col-span-3 mt-6"
                                    onValueChange={(val) =>
                                        setInclination(val as [number, number])
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel asChild>
                            <Button type="submit">
                                Show Results
                            </Button>
                        </AlertDialog.Cancel>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </div>
    );
};

export default Filter;
