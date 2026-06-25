import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Country, CountryFeatureCollection, CountryProperties } from "../data/types";
import { toSlug } from "./ids";

type CountriesTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

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
  return collection.features
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
    })
    .sort((a, b) => a.name.localeCompare(b.name));
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
