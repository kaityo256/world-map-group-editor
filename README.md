# World Map Group Editor

A browser-based editor for coloring countries on a world map by assigning them to editable groups.

Use the app here: [World Map Group Editor](https://kaityo256.github.io/world-map-group-editor)

## Features

- Display a Natural Earth 1:110m world map.
- Create, rename, and delete country groups.
- Assign countries to groups using country search.
- Choose group colors from built-in palettes.
- Use custom group colors.
- Change the map center longitude with presets or a custom value.
- Export the map as a PNG.
- Choose transparent or white export background.
- Choose Small, Middle, Large, or Custom export size.

## Usage

1. Open the app in a browser.
2. Select a map center from `Map Center`.
3. Choose a color palette from `Color Palette`.
4. Edit group names and colors as needed.
5. Search for a country inside a group.
6. Select a country candidate and click `+` to assign it to the group.
7. Select an assigned country and click `-` to remove it.
8. Click `Add Group` to create another group.
9. Set export options such as image size and background transparency.
10. Click `Save As` to save the map as a PNG.

The same country cannot be assigned to multiple groups.

## Development

The application source is under `docs/`.

```bash
cd docs
npm install
npm run dev
```

Build:

```bash
cd docs
npm run build
```

## License

The application code is licensed under the MIT License.

The map data in `docs/public/data/countries-110m.topojson` is derived from Natural Earth `Admin 0 - Countries`, `1:110m`. Natural Earth states that its raster and vector map data are in the public domain and may be used in any manner. See Natural Earth's Terms of Use:

https://www.naturalearthdata.com/about/terms-of-use/
