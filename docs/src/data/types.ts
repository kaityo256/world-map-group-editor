import type { Feature, FeatureCollection, Geometry } from "geojson";

export type CountryProperties = {
  NAME?: string;
  NAME_EN?: string;
  ISO_A3?: string | number;
  ADM0_A3?: string | number;
  [key: string]: unknown;
};

export type CountryFeature = Feature<Geometry, CountryProperties>;
export type CountryFeatureCollection = FeatureCollection<Geometry, CountryProperties>;

export type Country = {
  id: string;
  name: string;
  isoCode?: string;
  searchText: string;
  feature: CountryFeature;
};

export type ColorPalette = {
  id: "standard" | "colorblind" | "pastel" | "vivid" | "muted";
  name: string;
  colors: string[];
};

export type Group = {
  id: string;
  name: string;
  color: string;
  paletteColorIndex: number;
  customColorEnabled: boolean;
  customColor: string;
  countryIds: string[];
};

export type MapCenterMode = "japan" | "europe" | "americas" | "pacific" | "custom";
export type ExportSizeMode = "small" | "middle" | "large" | "custom";

export type AppState = {
  selectedPaletteId: ColorPalette["id"];
  mapCenterMode: MapCenterMode;
  customCenterLongitude: number;
  groups: Group[];
  transparentBackground: boolean;
  exportSizeMode: ExportSizeMode;
  customExportWidth: number;
  customExportHeight: number;
};
