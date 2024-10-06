import React, { useEffect, useState, createContext } from "react";

interface OrbitalPropagatorContextType {
    get_coordinates: ((input: string) => string) | undefined;
    get_orbit_paths: ((input: string) => string) | undefined;
}

const OrbitalPropagatorContext = createContext<
    OrbitalPropagatorContextType | undefined
>(undefined);

interface ProviderProps {
    children: React.ReactNode;
}

const OrbitalPropagatorProvider: React.FC<ProviderProps> = ({ children }) => {
    const [wasm, setWasm] = useState<OrbitalPropagatorContextType | null>(null);

    async function fetchWasm() {
        const theWasm = await import("../wasm/orbital_propagator.js");
        setWasm(theWasm);
    }

    useEffect(() => {
        fetchWasm();
    }, []);

    return (
        <OrbitalPropagatorContext.Provider
            value={{
                get_coordinates: wasm?.get_coordinates,
                get_orbit_paths: wasm?.get_orbit_paths,
            }}
        >
            {children}
        </OrbitalPropagatorContext.Provider>
    );
};

export { OrbitalPropagatorContext, OrbitalPropagatorProvider };
