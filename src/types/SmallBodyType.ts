export interface SmallBodyType {
  id: number;
  primary_designation: string;
  semi_major_axis: number;
  eccentricity: number;
  inclination: number;
  mean_anomaly: number;
  period: number;
  orbit_class: string;
  date_first_obs: Date;
  date_last_obs: Date;
}