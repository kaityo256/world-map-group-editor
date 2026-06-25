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
  const { paths, markers } = buildMapShapes({
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
              {markers.map((item) => (
                <circle key={item.id} cx={item.x} cy={item.y} r={item.radius} fill={item.fill}>
                  <title>{item.name}</title>
                </circle>
              ))}
            </g>
          </svg>
        ) : null}
      </div>
    </section>
  );
}

export function renderMapSvgMarkup(options: RenderOptions): string {
  const { paths, markers } = buildMapShapes({
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
  const markerMarkup = markers
    .map(
      (item) =>
        `<circle cx="${roundSvgNumber(item.x)}" cy="${roundSvgNumber(item.y)}" r="${roundSvgNumber(item.radius)}" fill="${item.fill}" />`
    )
    .join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}">`,
    background,
    `<g>${pathMarkup}${markerMarkup}</g>`,
    "</svg>"
  ].join("");
}

function buildMapShapes({
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
  const markerRadius = Math.max(1.3, Math.min(2.3, Math.min(width, height) * 0.003));

  const paths = countries
    .filter((country) => !country.marker)
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

  const markers = countries
    .filter((country) => Boolean(country.marker) && countryColors.has(country.id))
    .map((country) => {
      const marker = country.marker;
      if (!marker) return null;
      const point = projection([marker.longitude, marker.latitude]);
      return point
        ? {
            id: country.id,
            name: country.name,
            x: point[0],
            y: point[1],
            radius: markerRadius,
            fill: countryColors.get(country.id) || UNASSIGNED_COLOR
          }
        : null;
    })
    .filter((item): item is { id: string; name: string; x: number; y: number; radius: number; fill: string } => item !== null);

  return { paths, markers };
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function roundSvgNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}
