import { useState, createContext, useContext, useCallback } from "react";
import { Coordinates } from "./coordinates";

interface Planet {
    id: number;
    x_equatorial: number;
    y_equatorial: number;
    z_equatorial: number;
}

interface OrbitPropagatorContextType {
    planets: Planet[];
    handleSetPlanets(coordinates: Coordinates[]): void;
}

const OrbitPropagatorContext = createContext<
    OrbitPropagatorContextType | undefined
>(undefined);

const OrbitPropagatorProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [planets, setPlanets] = useState<Planet[]>([]);

    const handleSetPlanets = useCallback((newPlanets: Planet[]) => {
        setPlanets(newPlanets);
    }, []);

    return (
        <OrbitPropagatorContext.Provider value={{ planets, handleSetPlanets }}>
            {children}
        </OrbitPropagatorContext.Provider>
    );
};

function useOrbitPropagator() {
    const context = useContext(OrbitPropagatorContext);
    if (context === undefined) {
        throw new Error(
            "useOrbitPropagator must be used within a OrbitPropagatorProvider"
        );
    }
    return context;
}

export { OrbitPropagatorProvider, OrbitPropagatorContext, useOrbitPropagator };
