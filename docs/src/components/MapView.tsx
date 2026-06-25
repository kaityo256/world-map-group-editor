import { geoNaturalEarth1, geoPath } from "d3";
import type { GeoPermissibleObjects } from "d3";
import type { Country } from "../data/types";

const DISPLAY_WIDTH = 960;
const DISPLAY_HEIGHT = 540;
const UNASSIGNED_COLOR = "#E5E7EB";
const BORDER_COLOR = "#9CA3AF";
const EXPORT_BACKGROUND = "#FFFFFF";
const MAP_PADDING = 18;

type MapViewProps = {
  countries: Country[];
  countryColors: Map<string, string>;
  centerLongitude: number;
  isLoading?: boolean;
  error?: string;
};

type RenderOptions = {
  countries: Country[];
  countryColors: Map<string, string>;
  centerLongitude: number;
  width: number;
  height: number;
  transparentBackground: boolean;
};

export function MapView({ countries, countryColors, centerLongitude, isLoading, error }: MapViewProps) {
  const paths = buildCountryPaths({
    countries,
    countryColors,
    centerLongitude,
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    padding: MAP_PADDING
  });

  return (
    <section className="map-panel" aria-label="World map">
      <div className="map-frame">
        {isLoading ? <div className="map-status">Loading map...</div> : null}
        {error ? <div className="map-status map-error">{error}</div> : null}
        {!isLoading && !error ? (
          <svg className="map-svg" viewBox={`0 0 ${DISPLAY_WIDTH} ${DISPLAY_HEIGHT}`} role="img" aria-label="Colored world map">
            <rect width={DISPLAY_WIDTH} height={DISPLAY_HEIGHT} fill="#FFFFFF" />
            <g>
              {paths.map((item) => (
                <path key={item.id} d={item.d} fill={item.fill} stroke={BORDER_COLOR} strokeWidth="0.8" vectorEffect="non-scaling-stroke">
                  <title>{item.name}</title>
                </path>
              ))}
            </g>
          </svg>
        ) : null}
      </div>
    </section>
  );
}

export function renderMapSvgMarkup(options: RenderOptions): string {
  const paths = buildCountryPaths({
    countries: options.countries,
    countryColors: options.countryColors,
    centerLongitude: options.centerLongitude,
    width: options.width,
    height: options.height,
    padding: Math.max(12, Math.round(Math.min(options.width, options.height) * 0.035))
  });
  const background = options.transparentBackground ? "" : `<rect width="${options.width}" height="${options.height}" fill="${EXPORT_BACKGROUND}" />`;
  const pathMarkup = paths
    .map((item) => `<path d="${escapeAttribute(item.d)}" fill="${item.fill}" stroke="${BORDER_COLOR}" stroke-width="1" vector-effect="non-scaling-stroke" />`)
    .join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}">`,
    background,
    `<g>${pathMarkup}</g>`,
    "</svg>"
  ].join("");
}

function buildCountryPaths({
  countries,
  countryColors,
  centerLongitude,
  width,
  height,
  padding
}: {
  countries: Country[];
  countryColors: Map<string, string>;
  centerLongitude: number;
  width: number;
  height: number;
  padding: number;
}) {
  const projection = geoNaturalEarth1().rotate([-centerLongitude, 0]);
  projection.fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding]
    ],
    { type: "Sphere" }
  );
  const path = geoPath(projection);

  return countries
    .map((country) => {
      const d = path(country.feature as GeoPermissibleObjects);
      return d
        ? {
            id: country.id,
            name: country.name,
            d,
            fill: countryColors.get(country.id) || UNASSIGNED_COLOR
          }
        : null;
    })
    .filter((item): item is { id: string; name: string; d: string; fill: string } => item !== null);
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
