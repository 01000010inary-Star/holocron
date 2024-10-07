import { X } from "lucide-react";
import { create, useModal } from "@ebay/nice-modal-react";
import { AlertDialog, Button } from "@/components/ui";
import { CuteRocket } from "@/components/cute-rocket";

interface SelectedAsteroidDialogProps {
    name: string;
    image?: string;

    eccentricityRad: number;
    eccentricityRadCentury: number;

    inclinationDeg: number;
    inclinationDegCentury: number;

    longitudeAscNodeDeg: number;
    longitudeAscNodeDegCentury: number;

    meanLongitudeDeg: number;
    meanLongitudeDegCentury: number;

    semiMajorAxisAu: number;
    onViewDetails: () => void;
}

export const SelectedAsteroidDialog = create<SelectedAsteroidDialogProps>(
    ({
        name,
        image,
        eccentricityRad,
        eccentricityRadCentury,
        inclinationDeg,
        inclinationDegCentury,
        longitudeAscNodeDegCentury,
        longitudeAscNodeDeg,
        meanLongitudeDeg,
        meanLongitudeDegCentury,
        semiMajorAxisAu,
        onViewDetails,
    }) => {
        const { visible, hide } = useModal();

        return (
            <AlertDialog
                open={visible}
                onOpenChange={(state) => (!state ? hide() : null)}
            >
                <AlertDialog.Portal>
                    <AlertDialog.Content className="space-y-8 max-w-[624px]" aligment="left">
                        <AlertDialog.Header>
                            <div className="flex justify-between">
                                <div>
                                    <AlertDialog.Title className="text-xl font-normal">
                                        {name}
                                    </AlertDialog.Title>
                                    {/* <AlertDialog.Description className="text-white">
                                        {type}
                                    </AlertDialog.Description> */}
                                </div>
                                <Button
                                    variant="ghost"
                                    className="p-2 h-10"
                                    onClick={hide}
                                >
                                    <X className="text-white w-6 h-6" />
                                </Button>
                            </div>
                        </AlertDialog.Header>

                        {image && (
                            <img
                                src={image}
                                width={252}
                                className="mx-auto"
                                alt={`${name} image`}
                            />
                        )}

                        <div>
                            <ul className="grid grid-cols-1 gap-6">
                                <li>
                                    <span>
                                        Semi-Major Axis: {semiMajorAxisAu} AU
                                    </span>
                                    <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                </li>
                                <ul className="grid grid-cols-2">
                                    <li>
                                        <span>
                                            Eccentricity: {eccentricityRad}{" "}
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                    <li>
                                        <span>
                                            Eccentricity Change (Century):{" "}
                                            {eccentricityRadCentury} AU
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                </ul>
                                <ul className="grid grid-cols-2">
                                    <li>
                                        <span>
                                            Inclination: {inclinationDeg}°
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                    <li>
                                        <span>
                                            Inclination Change (Century):{" "}
                                            {inclinationDegCentury}°{" "}
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                </ul>
                                <ul className="grid grid-cols-2">
                                    <li>
                                        <span>
                                            Longitude of Ascending Node:{" "}
                                            {longitudeAscNodeDeg}°
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                    <li>
                                        <span>
                                            Ascending Node Change (Century){" "}
                                            {longitudeAscNodeDegCentury}°{" "}
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                </ul>
                                <ul className="grid grid-cols-2">
                                    <li>
                                        <span>
                                            Longitude of Perihelion:{" "}
                                            {meanLongitudeDeg}°
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                    <li>
                                        <span>
                                            Mean Longitude Change (Century):{" "}
                                            {meanLongitudeDegCentury}°{" "}
                                        </span>
                                        <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                                    </li>
                                </ul>
                            </ul>
                        </div>

                        {/* <AlertDialog.Footer className="w-full">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={onViewDetails}
                            >
                                Full View
                            </Button>
                        </AlertDialog.Footer> */}
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        );
    }
);
