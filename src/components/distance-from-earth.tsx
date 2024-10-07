import { CuteRocket } from './cute-rocket';

interface DistanceFromEarthProps {
    distance: number;
}

export function DistanceFromEarth({ distance }: DistanceFromEarthProps) {
    // TODO: add unit conversion
    // TODO: change color based on distance
    return (
        <span className="text-green-500 flex items-center gap-1">
            <CuteRocket />
            Distance: {distance}
        </span>
    );
}
