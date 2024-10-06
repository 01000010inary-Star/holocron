import React, { useEffect, useState, createContext } from "react";

interface Wasm {
    get_coordinates:
        | ((input: string, is_planet: boolean) => string)
        | undefined;
    get_orbit_paths:
        | ((input: string, is_planet: boolean) => string)
        | undefined;
}

interface OrbitalPropagatorContextType extends Wasm {
    ready: boolean;
}

const OrbitalPropagatorContext = createContext<
    OrbitalPropagatorContextType | undefined
>(undefined);

interface ProviderProps {
    children: React.ReactNode;
}

const OrbitalPropagatorProvider: React.FC<ProviderProps> = ({ children }) => {
    const [wasm, setWasm] = useState<Wasm | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function fetchWasm() {
            const theWasm = await import("../wasm/orbital_propagator.js");
            setWasm(theWasm);
            setReady(true);
        }
        fetchWasm();
    }, []);

    return (
        <OrbitalPropagatorContext.Provider
            value={{
                get_coordinates: wasm?.get_coordinates,
                get_orbit_paths: wasm?.get_orbit_paths,
                ready,
            }}
        >
            {children}
        </OrbitalPropagatorContext.Provider>
    );
};

export { OrbitalPropagatorContext, OrbitalPropagatorProvider };
