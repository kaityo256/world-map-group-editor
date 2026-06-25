import { feature } from "topojson-client";
import type { Point } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Country, CountryFeature, CountryFeatureCollection, CountryProperties } from "../data/types";
import { toSlug } from "./ids";

type CountriesTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

const markerCountries: Array<{
  id: string;
  name: string;
  aliases: string[];
  longitude: number;
  latitude: number;
}> = [
  {
    id: "HKG",
    name: "Hong Kong",
    aliases: ["Hong Kong SAR", "Hong Kong Special Administrative Region", "HKG", "香港"],
    longitude: 114.1694,
    latitude: 22.3193
  },
  {
    id: "MAC",
    name: "Macao / Macau",
    aliases: ["Macao", "Macau", "Macao SAR", "Macau SAR", "MAC", "マカオ"],
    longitude: 113.5439,
    latitude: 22.1987
  },
  {
    id: "SGP",
    name: "Singapore",
    aliases: ["Republic of Singapore", "SGP", "シンガポール"],
    longitude: 103.8198,
    latitude: 1.3521
  },
  {
    id: "ALA",
    name: "Åland Islands",
    aliases: ["Aland Islands", "ALA"],
    longitude: 19.9156,
    latitude: 60.1785
  },
  {
    id: "ASM",
    name: "American Samoa",
    aliases: ["ASM"],
    longitude: -170.702,
    latitude: -14.271
  },
  {
    id: "AND",
    name: "Andorra",
    aliases: ["Principality of Andorra", "AND"],
    longitude: 1.5218,
    latitude: 42.5063
  },
  {
    id: "AIA",
    name: "Anguilla",
    aliases: ["AIA"],
    longitude: -63.0686,
    latitude: 18.2206
  },
  {
    id: "ATG",
    name: "Antigua and Barbuda",
    aliases: ["ATG"],
    longitude: -61.7964,
    latitude: 17.0608
  },
  {
    id: "ABW",
    name: "Aruba",
    aliases: ["ABW"],
    longitude: -69.9683,
    latitude: 12.5211
  },
  {
    id: "BHR",
    name: "Bahrain",
    aliases: ["Kingdom of Bahrain", "BHR"],
    longitude: 50.5577,
    latitude: 26.0667
  },
  {
    id: "BRB",
    name: "Barbados",
    aliases: ["BRB"],
    longitude: -59.5432,
    latitude: 13.1939
  },
  {
    id: "BMU",
    name: "Bermuda",
    aliases: ["BMU"],
    longitude: -64.7505,
    latitude: 32.3078
  },
  {
    id: "BES",
    name: "Bonaire, Sint Eustatius and Saba",
    aliases: ["Caribbean Netherlands", "BES"],
    longitude: -68.2624,
    latitude: 12.1784
  },
  {
    id: "BVT",
    name: "Bouvet Island",
    aliases: ["BVT"],
    longitude: 3.4132,
    latitude: -54.4232
  },
  {
    id: "IOT",
    name: "British Indian Ocean Territory",
    aliases: ["IOT"],
    longitude: 72.4243,
    latitude: -7.3346
  },
  {
    id: "CPV",
    name: "Cabo Verde",
    aliases: ["Cape Verde", "Republic of Cabo Verde", "CPV"],
    longitude: -23.6052,
    latitude: 15.1201
  },
  {
    id: "CYM",
    name: "Cayman Islands",
    aliases: ["CYM"],
    longitude: -80.567,
    latitude: 19.3133
  },
  {
    id: "CXR",
    name: "Christmas Island",
    aliases: ["CXR"],
    longitude: 105.6904,
    latitude: -10.4475
  },
  {
    id: "CCK",
    name: "Cocos (Keeling) Islands",
    aliases: ["Cocos Islands", "Keeling Islands", "CCK"],
    longitude: 96.871,
    latitude: -12.1642
  },
  {
    id: "COM",
    name: "Comoros",
    aliases: ["Union of the Comoros", "COM"],
    longitude: 43.3333,
    latitude: -11.6455
  },
  {
    id: "COK",
    name: "Cook Islands",
    aliases: ["COK"],
    longitude: -159.7777,
    latitude: -21.2367
  },
  {
    id: "CUW",
    name: "Curaçao",
    aliases: ["Curacao", "CUW"],
    longitude: -68.99,
    latitude: 12.1696
  },
  {
    id: "DMA",
    name: "Dominica",
    aliases: ["Commonwealth of Dominica", "DMA"],
    longitude: -61.371,
    latitude: 15.415
  },
  {
    id: "FRO",
    name: "Faroe Islands",
    aliases: ["FRO"],
    longitude: -6.9118,
    latitude: 61.8926
  },
  {
    id: "GUF",
    name: "French Guiana",
    aliases: ["GUF"],
    longitude: -53.1258,
    latitude: 3.9339
  },
  {
    id: "PYF",
    name: "French Polynesia",
    aliases: ["PYF"],
    longitude: -149.4068,
    latitude: -17.6797
  },
  {
    id: "GIB",
    name: "Gibraltar",
    aliases: ["GIB"],
    longitude: -5.3536,
    latitude: 36.1408
  },
  {
    id: "GRD",
    name: "Grenada",
    aliases: ["GRD"],
    longitude: -61.679,
    latitude: 12.1165
  },
  {
    id: "GLP",
    name: "Guadeloupe",
    aliases: ["GLP"],
    longitude: -61.551,
    latitude: 16.265
  },
  {
    id: "GUM",
    name: "Guam",
    aliases: ["GUM"],
    longitude: 144.7937,
    latitude: 13.4443
  },
  {
    id: "GGY",
    name: "Guernsey",
    aliases: ["Bailiwick of Guernsey", "GGY"],
    longitude: -2.5853,
    latitude: 49.4657
  },
  {
    id: "HMD",
    name: "Heard Island and McDonald Islands",
    aliases: ["HMD"],
    longitude: 73.5042,
    latitude: -53.0818
  },
  {
    id: "VAT",
    name: "Holy See",
    aliases: ["Vatican City", "Vatican", "VAT"],
    longitude: 12.4534,
    latitude: 41.9029
  },
  {
    id: "IMN",
    name: "Isle of Man",
    aliases: ["IMN"],
    longitude: -4.5481,
    latitude: 54.2361
  },
  {
    id: "JEY",
    name: "Jersey",
    aliases: ["JEY"],
    longitude: -2.1313,
    latitude: 49.2144
  },
  {
    id: "KIR",
    name: "Kiribati",
    aliases: ["Republic of Kiribati", "KIR"],
    longitude: 172.979,
    latitude: 1.4518
  },
  {
    id: "LIE",
    name: "Liechtenstein",
    aliases: ["Principality of Liechtenstein", "LIE"],
    longitude: 9.5554,
    latitude: 47.166
  },
  {
    id: "MDV",
    name: "Maldives",
    aliases: ["Republic of Maldives", "MDV"],
    longitude: 73.2207,
    latitude: 3.2028
  },
  {
    id: "MLT",
    name: "Malta",
    aliases: ["Republic of Malta", "MLT"],
    longitude: 14.3754,
    latitude: 35.9375
  },
  {
    id: "MHL",
    name: "Marshall Islands",
    aliases: ["Republic of the Marshall Islands", "MHL"],
    longitude: 171.1845,
    latitude: 7.1315
  },
  {
    id: "MTQ",
    name: "Martinique",
    aliases: ["MTQ"],
    longitude: -61.0242,
    latitude: 14.6415
  },
  {
    id: "MUS",
    name: "Mauritius",
    aliases: ["Republic of Mauritius", "MUS"],
    longitude: 57.5522,
    latitude: -20.3484
  },
  {
    id: "MYT",
    name: "Mayotte",
    aliases: ["MYT"],
    longitude: 45.1662,
    latitude: -12.8275
  },
  {
    id: "FSM",
    name: "Micronesia",
    aliases: ["Federated States of Micronesia", "FSM"],
    longitude: 158.2151,
    latitude: 6.8875
  },
  {
    id: "MCO",
    name: "Monaco",
    aliases: ["Principality of Monaco", "MCO"],
    longitude: 7.4246,
    latitude: 43.7384
  },
  {
    id: "MSR",
    name: "Montserrat",
    aliases: ["MSR"],
    longitude: -62.1874,
    latitude: 16.7425
  },
  {
    id: "NRU",
    name: "Nauru",
    aliases: ["Republic of Nauru", "NRU"],
    longitude: 166.9315,
    latitude: -0.5228
  },
  {
    id: "NIU",
    name: "Niue",
    aliases: ["NIU"],
    longitude: -169.8672,
    latitude: -19.0544
  },
  {
    id: "NFK",
    name: "Norfolk Island",
    aliases: ["NFK"],
    longitude: 167.9547,
    latitude: -29.0408
  },
  {
    id: "MNP",
    name: "Northern Mariana Islands",
    aliases: ["MNP"],
    longitude: 145.6739,
    latitude: 15.0979
  },
  {
    id: "PLW",
    name: "Palau",
    aliases: ["Republic of Palau", "PLW"],
    longitude: 134.5825,
    latitude: 7.515
  },
  {
    id: "PCN",
    name: "Pitcairn",
    aliases: ["Pitcairn Islands", "PCN"],
    longitude: -130.1015,
    latitude: -25.0663
  },
  {
    id: "REU",
    name: "Réunion",
    aliases: ["Reunion", "REU"],
    longitude: 55.5364,
    latitude: -21.1151
  },
  {
    id: "BLM",
    name: "Saint Barthélemy",
    aliases: ["Saint Barthelemy", "St. Barthelemy", "BLM"],
    longitude: -62.8333,
    latitude: 17.9
  },
  {
    id: "SHN",
    name: "Saint Helena, Ascension and Tristan da Cunha",
    aliases: ["Saint Helena", "Ascension Island", "Tristan da Cunha", "SHN"],
    longitude: -5.7181,
    latitude: -15.965
  },
  {
    id: "KNA",
    name: "Saint Kitts and Nevis",
    aliases: ["St. Kitts and Nevis", "KNA"],
    longitude: -62.783,
    latitude: 17.3578
  },
  {
    id: "LCA",
    name: "Saint Lucia",
    aliases: ["St. Lucia", "LCA"],
    longitude: -60.9789,
    latitude: 13.9094
  },
  {
    id: "MAF",
    name: "Saint Martin",
    aliases: ["Saint Martin (French part)", "St. Martin", "MAF"],
    longitude: -63.0501,
    latitude: 18.0708
  },
  {
    id: "SPM",
    name: "Saint Pierre and Miquelon",
    aliases: ["St. Pierre and Miquelon", "SPM"],
    longitude: -56.2711,
    latitude: 46.8852
  },
  {
    id: "VCT",
    name: "Saint Vincent and the Grenadines",
    aliases: ["St. Vincent and the Grenadines", "VCT"],
    longitude: -61.2872,
    latitude: 12.9843
  },
  {
    id: "WSM",
    name: "Samoa",
    aliases: ["Independent State of Samoa", "WSM"],
    longitude: -172.1046,
    latitude: -13.759
  },
  {
    id: "SMR",
    name: "San Marino",
    aliases: ["Republic of San Marino", "SMR"],
    longitude: 12.4578,
    latitude: 43.9424
  },
  {
    id: "STP",
    name: "Sao Tome and Principe",
    aliases: ["São Tomé and Príncipe", "STP"],
    longitude: 6.6131,
    latitude: 0.1864
  },
  {
    id: "SYC",
    name: "Seychelles",
    aliases: ["Republic of Seychelles", "SYC"],
    longitude: 55.492,
    latitude: -4.6796
  },
  {
    id: "SXM",
    name: "Sint Maarten",
    aliases: ["Sint Maarten (Dutch part)", "SXM"],
    longitude: -63.0578,
    latitude: 18.0425
  },
  {
    id: "SGS",
    name: "South Georgia and the South Sandwich Islands",
    aliases: ["SGS"],
    longitude: -36.5879,
    latitude: -54.4296
  },
  {
    id: "SJM",
    name: "Svalbard and Jan Mayen",
    aliases: ["Svalbard", "Jan Mayen", "SJM"],
    longitude: 23.6703,
    latitude: 77.875
  },
  {
    id: "TKL",
    name: "Tokelau",
    aliases: ["TKL"],
    longitude: -171.8559,
    latitude: -9.2002
  },
  {
    id: "TON",
    name: "Tonga",
    aliases: ["Kingdom of Tonga", "TON"],
    longitude: -175.1982,
    latitude: -21.1789
  },
  {
    id: "TCA",
    name: "Turks and Caicos Islands",
    aliases: ["TCA"],
    longitude: -71.7979,
    latitude: 21.694
  },
  {
    id: "TUV",
    name: "Tuvalu",
    aliases: ["TUV"],
    longitude: 179.1942,
    latitude: -7.1095
  },
  {
    id: "UMI",
    name: "United States Minor Outlying Islands",
    aliases: ["U.S. Minor Outlying Islands", "US Minor Outlying Islands", "UMI"],
    longitude: 166.6333,
    latitude: 19.2833
  },
  {
    id: "VGB",
    name: "Virgin Islands (British)",
    aliases: ["British Virgin Islands", "VGB"],
    longitude: -64.6399,
    latitude: 18.4207
  },
  {
    id: "VIR",
    name: "Virgin Islands (U.S.)",
    aliases: ["United States Virgin Islands", "U.S. Virgin Islands", "US Virgin Islands", "VIR"],
    longitude: -64.8963,
    latitude: 18.3358
  },
  {
    id: "WLF",
    name: "Wallis and Futuna",
    aliases: ["WLF"],
    longitude: -176.2044,
    latitude: -13.7687
  }
];

const invalidCodeValues = new Set(["", "-99", "NULL", "N/A"]);

function normalizedCode(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const code = String(value).trim();
  if (invalidCodeValues.has(code.toUpperCase())) return undefined;
  return code.toUpperCase();
}

function countryName(properties: CountryProperties): string {
  return String(properties.FORMAL_EN || properties.NAME_EN || properties.NAME || "Unnamed country");
}

function countryId(properties: CountryProperties, index: number): string {
  return normalizedCode(properties.ISO_A3) || normalizedCode(properties.ADM0_A3) || `${toSlug(countryName(properties)) || "country"}-${index}`;
}

function countrySearchText(properties: CountryProperties): string {
  return [
    properties.FORMAL_EN,
    properties.NAME,
    properties.NAME_EN,
    properties.ISO_A3,
    properties.ADM0_A3
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export async function loadCountries(): Promise<Country[]> {
  const dataUrl = `${import.meta.env.BASE_URL}data/countries-110m.topojson`;
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`Unable to load map data: ${response.status}`);
  }

  const topology = (await response.json()) as CountriesTopology;
  if (!topology.objects.countries) {
    throw new Error("Map data is missing objects.countries.");
  }

  const collection = feature(topology, topology.objects.countries) as unknown as CountryFeatureCollection;
  return [
    ...collection.features
    .map((countryFeature, index) => {
      const properties = countryFeature.properties || {};
      const isoCode = normalizedCode(properties.ISO_A3) || normalizedCode(properties.ADM0_A3);
      return {
        id: countryId(properties, index),
        name: countryName(properties),
        isoCode,
        searchText: countrySearchText(properties),
        feature: countryFeature
      };
    }),
    ...markerCountries.map(createMarkerCountry)
  ]
    .sort((a, b) => a.name.localeCompare(b.name));
}

function createMarkerCountry(country: (typeof markerCountries)[number]): Country {
  const properties: CountryProperties = {
    NAME: country.name,
    NAME_EN: country.name,
    ISO_A3: country.id,
    ADM0_A3: country.id
  };
  const geometry: Point = {
    type: "Point",
    coordinates: [country.longitude, country.latitude]
  };
  const markerFeature: CountryFeature = {
    type: "Feature",
    properties,
    geometry
  };

  return {
    id: country.id,
    name: country.name,
    isoCode: country.id,
    searchText: [country.name, ...country.aliases].join(" ").toLowerCase(),
    feature: markerFeature,
    marker: {
      longitude: country.longitude,
      latitude: country.latitude
    }
  };
}

export function searchCountries(countries: Country[], query: string, limit = 10): Country[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return countries
    .filter((country) => country.searchText.includes(normalizedQuery))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}
