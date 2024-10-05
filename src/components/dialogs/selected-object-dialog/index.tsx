import { X } from 'lucide-react';
import { AlertDialog, Button } from '../../ui';
import { CuteRocket } from './cute-rocket';

interface SelectedObjectDialogProps {
    name: string;
    type: string;
    image?: string;
    distance: number;
    diameter: number;
    density: number;
    onViewDetails: () => void;
}

export function SelectedObjectDialog({
    name,
    type,
    image,
    diameter,
    distance,
    density,
    onViewDetails,
}: SelectedObjectDialogProps) {
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
                                {type}
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
                            <span className="text-green-500 flex items-center gap-1">
                                <CuteRocket />
                                Distance: {distance}
                            </span>
                            <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                        </li>
                        <ul className="grid grid-cols-2">
                            <li>
                                <span>Diameter: {diameter} km</span>
                                <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                            </li>
                            <li>
                                <span>Density: {density}</span>
                                <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                            </li>
                        </ul>
                    </ul>
                </div>

                <AlertDialog.Footer className="w-full">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onViewDetails}
                    >
                        Full View
                    </Button>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}
