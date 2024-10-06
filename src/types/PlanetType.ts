export default interface PlanetType {
    id: number;
    name: string;
    semi_major_axis_au: number;
    semi_major_axis_au_century: number;
    eccentricity_rad: number;
    eccentricity_rad_century: number;
    inclination_deg: number;
    inclination_deg_century: number;
    mean_longitude_deg: number;
    mean_longitude_deg_century: number;
    longitude_perihelion_deg: number;
    longitude_perihelion_deg_century: number;
    longitude_asc_node_deg: number;
    longitude_asc_node_deg_century: number;
}
