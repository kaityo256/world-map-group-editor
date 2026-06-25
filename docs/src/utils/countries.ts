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
  return String(properties.NAME_EN || properties.NAME || "Unnamed country");
}

function countryId(properties: CountryProperties, index: number): string {
  return normalizedCode(properties.ISO_A3) || normalizedCode(properties.ADM0_A3) || `${toSlug(countryName(properties)) || "country"}-${index}`;
}

function countrySearchText(properties: CountryProperties): string {
  return [
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
