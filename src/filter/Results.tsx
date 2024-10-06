import * as React from "react";

import { Button } from "@/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label.tsx";
import Table from "@/filter/Table.tsx";
import {useContext} from "react";
import {DatabaseContext} from "@/contexts/DatabaseContext.tsx";

const Results: React.FC = () => {
    const { filteredDb } = useContext(DatabaseContext);
    return (
        <div className="absolute bottom-10 left-10 p-4 z-10">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline">{filteredDb.length} Results</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full">
                        <DrawerHeader className="relative flex justify-center items-center">
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 shrink-0 rounded-full"
                                >
                                    <Cross1Icon className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                            <DrawerTitle className="flex items-center">
                                Near-Earth Objects & Potentially Hazardous
                                Asteroids
                            </DrawerTitle>
                            <DrawerDescription>

                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0">
                            <div className="flex items-center justify-center space-x-2">
                                <Table />
                            </div>
                        </div>
                        <DrawerFooter></DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default Results;
