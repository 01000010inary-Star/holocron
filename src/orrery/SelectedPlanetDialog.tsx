import { X } from "lucide-react";
import { useRef } from 'react';
import { create, useModal } from "@ebay/nice-modal-react";
import { AlertDialog, Button } from "@/components/ui";
import { CuteRocket } from "@/components/cute-rocket";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Vector3, Color, Mesh, TextureLoader } from "three";
import PlanetType from "@/types/PlanetType.ts";

interface ModalPlanetProps {
    position: Vector3;
    planetId: string;
    planetName: string;
    planetColor: Color;
    planetTextureUrl: string | null;
    planetRadius?: number | null;
}

const ModalPlanetSphere: React.FC<ModalPlanetProps> = ({
    position,
    planetId,
    planetName,
    planetColor,
    planetTextureUrl,
    planetRadius,
}) => {
    const texture = planetTextureUrl ? useLoader(TextureLoader, planetTextureUrl) : null;
    const planetRef = useRef<Mesh>(null);

    useFrame(() => {
        if (planetRef.current) {
            planetRef.current.rotation.y += 0.001;
        }
    });

    return (
        <mesh ref={planetRef} key={`sphere-${planetId}`} position={position}>
            {/* [Radius, Width segments, Height segments] | more segements = smoother */}
            <sphereGeometry args={[planetRadius || 0.05, 128, 128]} />
            <meshStandardMaterial 
                map={texture || undefined}
                color={texture ? undefined : planetColor}
                transparent={true} 
                opacity={0.8} 
                wireframe={texture ? false : true}
            />
        </mesh>
    );
};


interface SelectedAsteroidDialogProps {
    name: string;
    image?: string | null;
    planetColor?: Color;
    keplerian_elements?: PlanetType;

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
        planetColor,
        keplerian_elements,
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
                        
                        <div className="flex flex-row space-x-4">

                        {image && (
                            <div className="bg-transparent relative h-60 w-60">
                                <Canvas 
                                    className="bg-transparent" >
                                    <ambientLight intensity={3} />
                                    <ModalPlanetSphere 
                                        // Center
                                        position={new Vector3(0,0,0)}
                                        planetId={keplerian_elements?.id ? `${keplerian_elements.id}` : "1"}
                                        planetName={name}
                                        planetColor={planetColor || new Color("#FF0000")}
                                        planetTextureUrl={image || null}
                                        planetRadius={3}
                                    />
                                </Canvas>
                            </div>
                        )}
                        
                        <div className="text-xs">
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
