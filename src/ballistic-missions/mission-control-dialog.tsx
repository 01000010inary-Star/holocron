import { AlertDialog, Button, Label, RadioGroup } from "@/components";

interface MissionControlDialogProps {
    estimatedTime: number;
    onLaunch: () => void;
}

export function MissionControlDialog({ estimatedTime, onLaunch }: MissionControlDialogProps) {
    return (
        <AlertDialog open>
            <AlertDialog.Content className="">
                <AlertDialog.Header>
                    <div className="flex justify-between">
                        <div>
                            <AlertDialog.Title className="text-xl font-normal">
                                Ballistic Mission Control
                            </AlertDialog.Title>
                        </div>
                    </div>
                </AlertDialog.Header>

                <div>
                    <Label className="text-md">Select Missile Type</Label>
                    <RadioGroup
                        defaultValue="option-one"
                        className="mt-3 space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroup.Item
                                value="kinetic"
                                id="kinetic"
                            />
                            <Label htmlFor="kinetic">
                                Kinetic Impact (high speed, non-explosive)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroup.Item
                                value="nuclear"
                                id="nuclear"
                            />
                            <Label htmlFor="nuclear">
                                Nuclear Payload (explosive impact)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroup.Item
                                value="laser"
                                id="laser"
                            />
                            <Label htmlFor="laser">
                                Laser Detonation (experimental tech)
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="mt-3">
                    <span>
                        Estimated Time to Destroy PHA: 6 hours 14 minutes
                    </span>
                    <div className="w-full h-[1px] mt-2 bg-gradient-to-r from-white/40 to-white/0" />
                </div>

                <AlertDialog.Footer className="w-full mt-8">
                    <Button className="w-full" onClick={onLaunch}>
                        Confirm
                    </Button>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}
