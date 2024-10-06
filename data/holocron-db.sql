create table small_body (
    id                  integer primary key,
    primary_designation text    not null,
    semi_major_axis     real    not null,
    eccentricity        real    not null,
    inclination         real    not null,
    longitude_asc_node  real    not null,
    arg_perihelion      real    not null,
    mean_anomaly        real    not null,
    period              real    not null,
    neo                 int     not null check(neo in (0, 1)),
    pha                 int     not null check(pha in (0, 1)),
    orbit_class         text    not null,
    date_first_obs      text    not null,
    date_last_obs       text    not null
);

create table planet (
    id                                  integer primary key,
    name                                text    not null,
    semi_major_axis_au                  real    not null,
    semi_major_axis_au_century          real    not null,
    eccentricity_rad                    real    not null,
    eccentricity_rad_century            real    not null,
    inclination_deg                     real    not null,
    inclination_deg_century             real    not null,
    mean_longitude_deg                  real    not null,
    mean_longitude_deg_century          real    not null,
    longitude_perihelion_deg            real    not null,
    longitude_perihelion_deg_century    real    not null,
    longitude_asc_node_deg              real    not null,
    longitude_asc_node_deg_century      real    not null
);

insert into planet values (
    1,
    'Mercury',
    0.38709927,
    0.00000037,
    0.20563593,
    0.00001906,
    7.00497902,
    -0.00594749,
    252.25032350,
    149472.67411175,
    77.45779628,
    0.16047689,
    48.33076593,
    -0.12534081
);

insert into planet values (
    2,
    'Venus',
    0.72333566,
    0.00000390,
    0.00677672,
    -0.00004107,
    3.39467605,
    -0.00078890,
    181.97909950,
    58517.81538729,
    131.60246718,
    0.00268329,
    76.67984255,
    -0.27769418
);

insert into planet values (
    3,
    'Earth',
    1.00000261,
    0.00000562,
    0.01671123,
    -0.00004392,
    -0.00001531,
    -0.01294668,
    100.46457166,
    35999.37244981,
    102.93768193,
    0.32327364,
    0.0,
    0.0
);

insert into planet values (
    4,
    'Mars',
    1.52371034,
    0.00001847,
    0.09339410,
    0.00007882,
    1.84969142,
    -0.00813131,
    -4.55343205,
    19140.30268499,
    -23.94362959,
    0.44441088,
    49.55953891,
    -0.29257343
);

insert into planet values (
    5,
    'Jupiter',
    5.20288700,
    -0.00011607,
    0.04838624,
    -0.00013253,
    1.30439695,
    -0.00183714,
    34.39644051,
    3034.74612775,
    14.72847983,
    0.21252668,
    100.47390909,
    0.20469106
);

insert into planet values (
    6,
    'Saturn',
    9.53667594,
    -0.00125060,
    0.05386179,
    -0.00050991,
    2.48599187,
    0.00193609,
    49.95424423,
    1222.49362201,
    92.59887831,
    -0.41897216,
    113.66242448,
    -0.28867794
);

insert into planet values (
    7,
    'Uranus',
    19.18916464,
    -0.00196176,
    0.04725744,
    -0.00004397,
    0.77263783,
    -0.00242939,
    313.2381045,
    428.48202785,
    170.95427630,
    0.40805281,
    74.01692503,
    0.04240589
);

insert into planet values (
    8,
    'Neptune',
    30.06992276,
    0.00026291,
    0.00859048,
    0.00005105,
    1.77004347,
    0.00035372,
    -55.12002969,
    218.45945325,
    44.96476227,
    -0.32241464,
    131.78422574,
    -0.00508664
);
