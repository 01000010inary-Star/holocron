import { X } from 'lucide-react';
import { AlertDialog, Button, DistanceFromEarth } from '@/components';
import { ThreadLevel } from './thread-level';
import { ThreadLevels } from './thread-levels';

interface SelectedMissionDialogProps {
    name: string;
    image?: string;
    distance: number;
    diameter: number;
    density: number;
    speed: number;
    composition: string;
    thread: ThreadLevels;
    onViewDetails: () => void;
}

export function SelectedMissionDialog({
    name,
    image,
    diameter,
    distance,
    composition,
    speed,
    density,
    onViewDetails,
}: SelectedMissionDialogProps) {
    return (
        <AlertDialog open>
            <AlertDialog.Content className="space-y-8">
                <AlertDialog.Header>
                    <div className="flex justify-between">
                        <div>
                            <AlertDialog.Title className="text-xl font-normal">
                                {name}
                            </AlertDialog.Title>
                            <AlertDialog.Description className="text-white">
                                (PHA) Potentially Hazardous Asteroid
                            </AlertDialog.Description>
                        </div>
                        <Button variant="ghost" className="p-2 h-10">
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
                            <ThreadLevel level="HIGH" />
                            <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                        </li>
                        <li>
                            <DistanceFromEarth distance={distance} />
                            <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                        </li>
                        <ul className="grid grid-cols-2">
                            <li>
                                <span>Density: {density} km</span>
                                <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                            </li>
                            <li>
                                <span>Diameter: {diameter}</span>
                                <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                            </li>
                        </ul>
                        <ul className="grid grid-cols-2">
                            <li>
                                <span>Composition: {composition} km</span>
                                <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                            </li>
                            <li>
                                <span>Relative Speed: {speed}</span>
                                <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                            </li>
                        </ul>
                    </ul>
                </div>

                <AlertDialog.Footer className="w-full">
                    <Button className="w-full" onClick={onViewDetails}>
                        Launch Ballistic Mission
                    </Button>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}
