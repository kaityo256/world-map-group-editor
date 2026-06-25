# PLANS.md

## Project

Create a responsive web application named `world-map-group-editor`.

The application lets users color countries on a world map by assigning countries to editable groups. The map should be displayed at the top of the screen, and the group editing UI should be displayed below the map. The UI language must be English.

Use Natural Earth `Admin 0 – Countries`, `1:110m` as the base world map data. The map should be displayed with Japan near the center by default. Users should be able to change the center longitude.

Place the application source code under the repository `docs/` directory. Treat `docs/` as the Vite application root.

## Main Goals

- Display a world map using Natural Earth `Admin 0 – Countries`, `1:110m`.
- Let users create, edit, and delete country groups.
- Let users assign countries to groups.
- Let users choose group colors from predefined color palettes.
- Let users override group colors with custom colors.
- Let users save the generated map image using a “Save As” button.
- Let users choose whether the saved image has a transparent background.
- Make the UI responsive and usable on smartphones.
- Use English for all UI labels, buttons, messages, and placeholders.

## Data

Use Natural Earth:

- Dataset: `Admin 0 – Countries`
- Scale: `1:110m`
- Purpose: country-level coloring
- Required properties:
  - Country name
  - ISO country code if available
  - Geometry for country polygons

The application should use the map data in a browser-friendly format, preferably GeoJSON or TopoJSON.

Store the browser-ready map data under:

```text
docs/public/data/countries-110m.topojson
```

The committed TopoJSON file must expose the country geometries as:

```text
objects.countries
```

Recommended preparation flow:

1. Download Natural Earth `Admin 0 – Countries`, `1:110m` from the official Natural Earth site.
2. Convert the Shapefile to GeoJSON.
3. Convert the GeoJSON to TopoJSON.
4. Commit the final TopoJSON file to `docs/public/data/`.

The application should load the map data using a Vite base-aware path, for example:

```ts
const dataUrl = `${import.meta.env.BASE_URL}data/countries-110m.topojson`;
```

This keeps the data path working in both local development and static deployments with a non-root base path.

Use stable country IDs derived from the Natural Earth properties. Prefer `ISO_A3` when it is present and valid. If `ISO_A3` is missing or invalid, fall back to `ADM0_A3`, then to a deterministic name-based ID.

Recommended country properties:

- Display name: `NAME_EN` if available, otherwise `NAME`
- ISO code: `ISO_A3` if available and valid, otherwise `ADM0_A3`
- Search fields: `NAME`, `NAME_EN`, `ISO_A3`, `ADM0_A3`

Country search and assignment should only include countries present in the loaded map data. Do not show or assign countries that are not included in `objects.countries`.

## Directory Structure

Use the following directory structure:

```text
docs/
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  index.html
  public/
    data/
      countries-110m.topojson
      README.md
  src/
    main.tsx
    App.tsx
    styles.css
    components/
      MapView.tsx
      GroupEditor.tsx
      GroupCard.tsx
      ColorPaletteSelector.tsx
      CountrySearch.tsx
      ExportControls.tsx
    data/
      colorPalettes.ts
      types.ts
    utils/
      countries.ts
      exportImage.ts
      ids.ts
```

Directory responsibilities:

- `docs/public/data/`: static browser assets copied and served by Vite as-is.
- `docs/src/components/`: React components for the map, group editor, country search, palette selector, and export controls.
- `docs/src/data/`: static TypeScript data and shared type definitions.
- `docs/src/utils/`: data normalization, ID handling, and PNG export helpers.

## Layout

The screen should be divided into two main areas.

### Top Area: Map

Display the world map at the top of the page.

Requirements:

- Japan should appear near the center of the map by default.
- Users should be able to change the map center longitude.
- Countries assigned to groups should be filled with the corresponding group color.
- Countries not assigned to any group should be filled with a neutral unassigned color.
- The map should resize according to the viewport width.
- The map should remain usable on both desktop and mobile screens.

Suggested default colors:

- Unassigned countries: light gray, e.g. `#E5E7EB`
- Country borders: medium gray, e.g. `#9CA3AF`
- Non-transparent export background: white, `#FFFFFF`

### Bottom Area: Group Editor

Place the group editing UI below the map.

The group editor should contain:

- Map center longitude controls
- Color palette selector
- Group list
- Add group button
- Per-group controls:
  - Group name input
  - Group color controls
  - Country search input
  - Add country button
  - Assigned country list
  - Remove country button
  - Delete group button

On small screens, the group editor should stack vertically and remain easy to use with touch input.

## Initial State

When the application starts, create three default groups.

Initial groups:

```text
Group 1
Group 2
Group 3
```

Each group should have:

- A unique ID
- A default name
- A default color from the currently selected color palette
- An empty country list
- Custom color mode disabled by default

## Group Management

### Add Group

Provide an “Add Group” button.

When the user clicks “Add Group”:

- Add a new group.
- Assign a default name such as `Group N`.
- Use a number `N` that does not conflict with existing group names.
- Assign the next available color from the currently selected color palette.
- Initialize the country list as empty.
- Initialize custom color mode as disabled.

### Delete Group

Each group should have a “Delete Group” button.

When the user deletes a group:

- Remove the group from the group list.
- Countries assigned to that group become unassigned.
- The map should update immediately.
- If the group contains countries, show a confirmation dialog before deleting.

Confirmation message:

```text
Delete this group?
Countries assigned to this group will become unassigned.
```

### Minimum Group Count

At least one group must always exist.

If there is only one group:

- Disable the “Delete Group” button for that group.
- Do not allow the last group to be deleted.

## Color Palette Feature

Place a color palette dropdown below the map and above the group list.

Label:

```text
Color Palette
```

The user can choose one of the following five color palette groups:

- Standard
- Colorblind Friendly
- Pastel
- Vivid
- Muted

Each palette should contain approximately 10 to 16 colors.

When the selected color palette changes:

- Update the options in each group’s color dropdown.
- Existing groups that are not in custom color mode may keep their current selected color if it exists in the new palette.
- If the current selected color is not available in the new palette, assign the nearest or corresponding color by index.
- Groups in custom color mode should keep their custom colors unchanged.

## Suggested Color Palettes

Define palettes similar to the following.

```ts
export const colorPalettes = [
  {
    id: "standard",
    name: "Standard",
    colors: [
      "#4E79A7", "#F28E2B", "#59A14F", "#E15759",
      "#B07AA1", "#76B7B2", "#EDC948", "#9C755F",
      "#FF9DA7", "#BAB0AC", "#8CD17D", "#A0CBE8"
    ]
  },
  {
    id: "colorblind",
    name: "Colorblind Friendly",
    colors: [
      "#E69F00", "#56B4E9", "#009E73", "#F0E442",
      "#0072B2", "#D55E00", "#CC79A7", "#999999"
    ]
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      "#A6CEE3", "#B2DF8A", "#FDBF6F", "#CAB2D6",
      "#FFFF99", "#FB9A99", "#1F78B4", "#33A02C",
      "#FF7F00", "#6A3D9A", "#B15928", "#BDBDBD"
    ]
  },
  {
    id: "vivid",
    name: "Vivid",
    colors: [
      "#1F77B4", "#FF7F0E", "#2CA02C", "#D62728",
      "#9467BD", "#17BECF", "#BCBD22", "#E377C2",
      "#8C564B", "#7F7F7F"
    ]
  },
  {
    id: "muted",
    name: "Muted",
    colors: [
      "#5B7C99", "#C58A4A", "#6F9A70", "#B66A6A",
      "#8A7EA8", "#6FA6A3", "#C7B45A", "#8B7567",
      "#B7899A", "#9A9A9A", "#7F9F8C", "#8DA9C4"
    ]
  }
];
```

## Group Color Controls

Each group should have the following color controls:

- A color dropdown
- A “Custom” checkbox
- A custom color text input
- A color picker button/input

### Normal Palette Mode

When “Custom” is unchecked:

- Enable the color dropdown.
- Disable the custom color text input.
- Disable the color picker.
- The selected color comes from the currently selected color palette.
- When the user changes the color dropdown, update the group color and map immediately.

### Custom Color Mode

When “Custom” is checked:

- Disable the color dropdown.
- Enable the custom color text input.
- Enable the color picker.
- The group color is defined by the custom color value.

### Custom Color Text Input

The custom color text input should accept RGB hex strings in the following format:

```text
#FFFFFF
#FF0000
#3366CC
```

Validation:

- The value must match `#[0-9A-Fa-f]{6}`.
- Invalid values should not be applied to the map.
- Show a clear validation message if the value is invalid.

Example validation message:

```text
Enter a valid color in #RRGGBB format.
```

### Color Picker

Place the color picker to the right of the custom color text input.

The color picker should allow users to choose any color.

When a color is selected:

- Update the custom color text input.
- Apply the selected color to the group.
- Update the map immediately.

## Country Assignment UI

Each group should provide a UI for adding and removing countries.

### Country Search

Each group should have a country search text box.

Placeholder:

```text
Search countries...
```

When the user types into the text box:

- Show country candidates using incremental search.
- Search should match country names.
- If available, also match English country names and ISO country codes.
- The search should be case-insensitive.
- Matching by partial text is sufficient.
- Show at most 10 matching candidates at a time.

The candidate list should appear below or near the search text box.

### Select Candidate

The user can select one country from the candidate list.

When selected:

- Store it as the pending country to add.
- Show the selected candidate clearly.
- Enable the add button.

### Add Country

Place a “+” button next to the country search input.

When the user clicks “+”:

- Add the selected country to the current group.
- Clear the search input.
- Clear the selected candidate.
- Update the assigned country list.
- Update the map immediately.

The “+” button should be disabled when no country candidate is selected.

### Duplicate Country Handling

A country should belong to at most one group.

If the user tries to add a country that already belongs to another group:

- Do not add it.
- Show a warning message.

Example warning:

```text
This country is already assigned to another group.
```

If the country is already assigned to the same group:

- Do not add a duplicate.
- Show a simple warning or silently ignore the action.

Show warning and validation messages near the related control or inside the related group panel. Clear a warning when the user changes the related input, selects a different candidate, or successfully completes the related action.

### Assigned Country List

Each group should display a list of countries assigned to that group.

The list should show:

- Country name
- ISO code if available

The user can select one country from the assigned country list.

The selected country should be visually highlighted.

### Remove Country

Place a “-” button near the assigned country list.

When the user selects a country in the assigned list and clicks “-”:

- Remove the country from the group.
- Clear the selected country state.
- Update the map immediately.
- The country becomes unassigned and should be displayed with the unassigned country color.

The “-” button should be disabled when no assigned country is selected.

## Map Rendering

The map should be rendered using SVG or Canvas.

SVG is preferred for easier export and interaction.

Recommended map behavior:

- Render all countries.
- Fill each country according to its assigned group color.
- Fill unassigned countries with the unassigned color.
- Draw country borders.
- Use Japan-centered longitude by default.
- Rotate or configure the map projection so that the selected center longitude appears near the horizontal center of the rendered map in both on-screen display and exported images.
- Use a projection suitable for a world map, such as Natural Earth or Equal Earth.

Suggested D3 projection concept:

```ts
const projection = d3.geoNaturalEarth1()
  .rotate([-centerLongitude, 0]);
```

Adjust the rotation and fitting so that the map is visually centered around the selected center longitude.

### Map Center Longitude

Place map center controls below the map and above the group list, near the color palette selector.

Label:

```text
Map Center
```

Provide preset options:

- Japan (`145`)
- Europe (`10`)
- Americas (`-95`)
- Pacific (`180`)
- Custom longitude

Default option:

```text
Japan
```

When a preset is selected:

- Use the preset longitude as the map center longitude.
- Disable the custom longitude input.
- Update the map immediately.

When “Custom longitude” is selected:

- Enable a custom longitude input.
- Use the custom longitude for the map projection.
- Validate that the value is a number from `-180` to `180`.
- Show a clear validation message if the value is invalid.
- Update the map immediately when the custom longitude is valid.

Suggested validation message:

```text
Enter a longitude from -180 to 180.
```

The same selected center longitude must be used for on-screen rendering and exported images.

## Save Image Feature

Provide a “Save As” button.

Label:

```text
Save As
```

The user should be able to save the generated map image.

The user should be able to choose the saved image size before saving.

Only the map area should be exported. The group editor UI, palette selector, controls, validation messages, and page chrome must not be included in the saved image.

### Background Transparency Option

Provide a checkbox or similar control near the “Save As” button.

Label:

```text
Transparent background
```

When saving the image:

- If “Transparent background” is checked:
  - Save the image with a transparent background.
- If “Transparent background” is unchecked:
  - Save the image with a white background.
  - The background color must be fixed to `#FFFFFF`.

### Export Size

Provide an export size selector near the “Save As” button.

Label:

```text
Image Size
```

The user can choose one of the following options:

- Small (`1280 × 720`)
- Middle (`1920 × 1080`)
- Large (`3840 × 2160`)
- Custom

Default option:

```text
Middle
```

Default custom width and height values:

```text
1920 × 1080
```

When a preset is selected:

- Use the preset width and height for the exported PNG.
- Disable the custom width and custom height inputs.

When “Custom” is selected:

- Enable custom width and custom height inputs.
- Use the custom width and height for the exported PNG.
- Validate that both values are positive whole numbers.
- Show a clear validation message if either value is invalid.

Suggested validation message:

```text
Enter a valid image width and height.
```

Suggested custom size limits:

- Minimum width: `320`
- Minimum height: `180`
- Maximum width: `7680`
- Maximum height: `4320`

The saved map should preserve the selected export dimensions exactly.

For every export size, fit the full world map inside the selected image dimensions while preserving the map projection shape. Empty margins are allowed when needed. The map must not be cropped or stretched.

### Export Format

Export as PNG by default.

The saved file should include the current map:

- Country colors
- Country borders
- Projection and map layout
- Background setting, either transparent or white
- Selected export size

The exported image should contain only the rendered map SVG converted to PNG at the selected dimensions.

Suggested default filename:

```text
world-map-groups.png
```

When the user clicks “Save As”:

- Open the system file save dialog when the browser supports it.
- Use `world-map-groups.png` as the suggested filename.
- Save the PNG to the location and filename chosen by the user.
- If the user cancels the system file save dialog, do not save the image.
- If the browser does not support the system file save dialog, fall back to downloading `world-map-groups.png`.

## Responsive Design

The application must be responsive and usable on smartphones.

Requirements:

- The map width should adapt to the screen width.
- The group editor should stack vertically on narrow screens.
- Buttons and inputs should be large enough for touch operation.
- Avoid horizontal scrolling on smartphones.
- Candidate lists and assigned country lists should remain usable on small screens.
- The layout should work at common mobile widths, such as 360px and 390px.

Suggested breakpoint:

```css
@media (max-width: 768px) {
  /* mobile layout */
}
```

## English UI Text

All UI text must be in English.

Use labels such as:

```text
Color Palette
Standard
Colorblind Friendly
Pastel
Vivid
Muted
Group Name
Color
Custom
Search countries...
Add Group
Delete Group
Save As
Transparent background
Image Size
Small
Middle
Large
Custom
Width
Height
Map Center
Japan
Europe
Americas
Pacific
Custom longitude
Longitude
Enter a longitude from -180 to 180.
Enter a valid image width and height.
Enter a valid color in #RRGGBB format.
This country is already assigned to another group.
Delete this group?
Countries assigned to this group will become unassigned.
```

## State Model

Use a clear state model.

Suggested structure:

```ts
type Country = {
  id: string;
  name: string;
  isoCode?: string;
};

type Group = {
  id: string;
  name: string;
  color: string;
  paletteColorIndex: number;
  customColorEnabled: boolean;
  customColor: string;
  countryIds: string[];
};

type AppState = {
  selectedPaletteId: string;
  mapCenterMode: "japan" | "europe" | "americas" | "pacific" | "custom";
  customCenterLongitude: number;
  groups: Group[];
  transparentBackground: boolean;
  exportSizeMode: "small" | "middle" | "large" | "custom";
  customExportWidth: number;
  customExportHeight: number;
};
```

A country must not be assigned to more than one group.

## Acceptance Criteria

The implementation is complete when the following conditions are met:

- The app displays a Natural Earth `Admin 0 – Countries`, `1:110m` world map.
- Japan appears near the center of the map by default.
- Users can choose the map center from Japan, Europe, Americas, Pacific, and Custom longitude.
- Custom longitude accepts valid numbers from `-180` to `180`.
- The selected map center longitude is used for both on-screen display and exported images.
- The UI is entirely in English.
- Three groups are shown by default.
- Users can add groups.
- Users can delete groups.
- The final remaining group cannot be deleted.
- Users can select one of five color palettes:
  - Standard
  - Colorblind Friendly
  - Pastel
  - Vivid
  - Muted
- Each group can choose a color from the selected palette.
- Each group can enable custom color mode.
- In custom color mode:
  - The palette color dropdown is disabled.
  - The custom color text input is enabled.
  - The color picker is enabled.
- In non-custom mode:
  - The palette color dropdown is enabled.
  - The custom color text input is disabled.
  - The color picker is disabled.
- Users can search countries with incremental search.
- Country search shows only countries included in the loaded map data.
- Country search shows no more than 10 candidates at a time.
- Users can add a selected country to a group with the “+” button.
- Users can remove a selected country from a group with the “-” button.
- A country cannot be assigned to multiple groups.
- The map updates immediately after group, color, add-country, remove-country, and map center longitude changes.
- Users can save the map image using the “Save As” button.
- When saving, supported browsers open the system file save dialog.
- The saved PNG uses the location and filename chosen in the system dialog.
- Saved images include only the map area, not the editor UI.
- Users can choose transparent or white background when saving.
- If transparency is disabled, the exported background is fixed to white.
- Users can choose a saved image size from Small, Middle, Large, and Custom.
- Small exports at `1280 × 720`.
- Middle exports at `1920 × 1080`.
- Large exports at `3840 × 2160`.
- Custom export size uses user-provided width and height.
- Custom export size defaults to `1920 × 1080`.
- Invalid custom export sizes are not saved and show a validation message.
- Exported maps fit inside the selected dimensions without cropping or stretching.
- The app is responsive and usable on smartphones.

## Implementation Notes

Prefer a simple, maintainable implementation.

Recommended stack:

- Vite
- TypeScript
- React
- D3.js for geographic rendering
- TopoJSON or GeoJSON for map data

Use `docs/` as the application root. Run package manager, development server, build, and test commands from `docs/`.

Configure Vite for static deployment from the repository `docs/` application root. Prefer:

```ts
base: "./"
```

This keeps built asset and data URLs relative, so the app works when served from a subdirectory such as GitHub Pages. Continue using `import.meta.env.BASE_URL` when loading `data/countries-110m.topojson`.

Keep the code modular:

- Map rendering component
- Group editor component
- Color palette selector component
- Country search component
- Export image utility
- Data loading utility

Keep generated or downloaded source map archives out of the application source unless they are intentionally documented. The app should depend on the committed browser-ready file at `docs/public/data/countries-110m.topojson`.

Avoid unnecessary backend functionality. The application can be implemented as a static frontend app.
