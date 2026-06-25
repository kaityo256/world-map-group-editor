import { useEffect, useMemo, useState } from "react";
import { ColorPaletteSelector } from "./components/ColorPaletteSelector";
import { exportSizePresets, ExportControls } from "./components/ExportControls";
import { GroupEditor } from "./components/GroupEditor";
import { MapView } from "./components/MapView";
import { colorPalettes, defaultPalette } from "./data/colorPalettes";
import type { AppState, ColorPalette, Country, ExportSizeMode, Group, MapCenterMode } from "./data/types";
import { loadCountries } from "./utils/countries";
import { exportMapPng } from "./utils/exportImage";
import { createId } from "./utils/ids";

const mapCenterPresets: Record<Exclude<MapCenterMode, "custom">, { label: string; longitude: number }> = {
  japan: { label: "Japan", longitude: 145 },
  europe: { label: "Europe", longitude: 10 },
  americas: { label: "Americas", longitude: -95 },
  pacific: { label: "Pacific", longitude: 180 }
};

const validHexColor = /^#[0-9A-Fa-f]{6}$/;

function createInitialGroups(): Group[] {
  return [0, 1, 2].map((index) => ({
    id: createId("group"),
    name: `Group ${index + 1}`,
    color: defaultPalette.colors[index],
    paletteColorIndex: index,
    customColorEnabled: false,
    customColor: defaultPalette.colors[index],
    countryIds: []
  }));
}

function createInitialState(): AppState {
  return {
    selectedPaletteId: "standard",
    mapCenterMode: "japan",
    customCenterLongitude: 145,
    groups: createInitialGroups(),
    transparentBackground: false,
    exportSizeMode: "middle",
    customExportWidth: 1920,
    customExportHeight: 1080
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(() => createInitialState());
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [customLongitudeInput, setCustomLongitudeInput] = useState("145");

  useEffect(() => {
    let active = true;
    loadCountries()
      .then((loadedCountries) => {
        if (!active) return;
        setCountries(loadedCountries);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load map data.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedPalette = useMemo(
    () => colorPalettes.find((palette) => palette.id === state.selectedPaletteId) || defaultPalette,
    [state.selectedPaletteId]
  );

  const centerLongitude = state.mapCenterMode === "custom" ? state.customCenterLongitude : mapCenterPresets[state.mapCenterMode].longitude;
  const centerError = state.mapCenterMode === "custom" ? validateLongitude(customLongitudeInput) : "";
  const exportSizeError = state.exportSizeMode === "custom" ? validateExportSize(state.customExportWidth, state.customExportHeight) : "";

  const countryColors = useMemo(() => {
    const colors = new Map<string, string>();
    for (const group of state.groups) {
      for (const countryId of group.countryIds) {
        colors.set(countryId, group.color);
      }
    }
    return colors;
  }, [state.groups]);

  function updateSelectedPalette(paletteId: ColorPalette["id"]) {
    const nextPalette = colorPalettes.find((palette) => palette.id === paletteId) || defaultPalette;
    setState((current) => ({
      ...current,
      selectedPaletteId: paletteId,
      groups: current.groups.map((group) => {
        if (group.customColorEnabled) return group;
        const existingIndex = nextPalette.colors.findIndex((color) => color.toLowerCase() === group.color.toLowerCase());
        const nextIndex = existingIndex >= 0 ? existingIndex : group.paletteColorIndex % nextPalette.colors.length;
        return {
          ...group,
          paletteColorIndex: nextIndex,
          color: nextPalette.colors[nextIndex]
        };
      })
    }));
  }

  function addGroup() {
    setState((current) => {
      const palette = colorPalettes.find((item) => item.id === current.selectedPaletteId) || defaultPalette;
      const groupNumber = nextGroupNumber(current.groups);
      const paletteColorIndex = current.groups.length % palette.colors.length;
      return {
        ...current,
        groups: [
          ...current.groups,
          {
            id: createId("group"),
            name: `Group ${groupNumber}`,
            color: palette.colors[paletteColorIndex],
            paletteColorIndex,
            customColorEnabled: false,
            customColor: palette.colors[paletteColorIndex],
            countryIds: []
          }
        ]
      };
    });
  }

  function updateGroup(groupId: string, updater: (group: Group) => Group) {
    setState((current) => ({
      ...current,
      groups: current.groups.map((group) => (group.id === groupId ? updater(group) : group))
    }));
  }

  function addCountryToGroup(groupId: string, country: Country): "added" | "duplicate-other" | "duplicate-same" {
    const owningGroup = state.groups.find((group) => group.countryIds.includes(country.id));
    if (owningGroup?.id === groupId) return "duplicate-same";
    if (owningGroup) return "duplicate-other";

    setState((current) => ({
      ...current,
      groups: current.groups.map((group) => (group.id === groupId ? { ...group, countryIds: [...group.countryIds, country.id] } : group))
    }));
    return "added";
  }

  function exportSize() {
    if (state.exportSizeMode === "custom") {
      return { width: state.customExportWidth, height: state.customExportHeight };
    }
    return exportSizePresets[state.exportSizeMode];
  }

  async function handleSave() {
    const customError = state.exportSizeMode === "custom" ? validateExportSize(state.customExportWidth, state.customExportHeight) : "";
    if (customError) return;
    const size = exportSize();
    await exportMapPng({
      countries,
      countryColors,
      centerLongitude,
      width: size.width,
      height: size.height,
      transparentBackground: state.transparentBackground
    });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>World Map Group Editor</h1>
      </header>

      <MapView countries={countries} countryColors={countryColors} centerLongitude={centerLongitude} isLoading={loading} error={loadError} />

      <section className="control-strip" aria-label="Map and export controls">
        <div className="map-center-controls">
          <label className="field">
            <span>Map Center</span>
            <select
              value={state.mapCenterMode}
              onChange={(event) => {
                const mode = event.target.value as MapCenterMode;
                setState((current) => ({
                  ...current,
                  mapCenterMode: mode,
                  customCenterLongitude: mode === "custom" ? current.customCenterLongitude : mapCenterPresets[mode].longitude
                }));
                if (mode !== "custom") {
                  setCustomLongitudeInput(String(mapCenterPresets[mode].longitude));
                }
              }}
            >
              <option value="japan">Japan</option>
              <option value="europe">Europe</option>
              <option value="americas">Americas</option>
              <option value="pacific">Pacific</option>
              <option value="custom">Custom longitude</option>
            </select>
          </label>
          <label className="field compact-field">
            <span>Longitude</span>
            <input
              type="number"
              min="-180"
              max="180"
              step="1"
              disabled={state.mapCenterMode !== "custom"}
              value={customLongitudeInput}
              onChange={(event) => {
                const value = event.target.value;
                setCustomLongitudeInput(value);
                const parsed = Number(value);
                if (value !== "" && Number.isFinite(parsed) && parsed >= -180 && parsed <= 180) {
                  setState((current) => ({ ...current, customCenterLongitude: parsed }));
                }
              }}
            />
          </label>
          {centerError ? <div className="validation-message">{centerError}</div> : null}
        </div>

        <ColorPaletteSelector palettes={colorPalettes} selectedPaletteId={state.selectedPaletteId} onChange={updateSelectedPalette} />

        <ExportControls
          transparentBackground={state.transparentBackground}
          exportSizeMode={state.exportSizeMode}
          customExportWidth={state.customExportWidth}
          customExportHeight={state.customExportHeight}
          customSizeError={exportSizeError}
          onTransparentChange={(enabled) => setState((current) => ({ ...current, transparentBackground: enabled }))}
          onSizeModeChange={(mode) => setState((current) => ({ ...current, exportSizeMode: mode }))}
          onCustomWidthChange={(width) => setState((current) => ({ ...current, customExportWidth: width }))}
          onCustomHeightChange={(height) => setState((current) => ({ ...current, customExportHeight: height }))}
          onSave={handleSave}
        />
      </section>

      <GroupEditor
        groups={state.groups}
        countries={countries}
        palette={selectedPalette}
        onAddGroup={addGroup}
        onRenameGroup={(groupId, name) => updateGroup(groupId, (group) => ({ ...group, name }))}
        onPaletteColorChange={(groupId, index) =>
          updateGroup(groupId, (group) => ({
            ...group,
            paletteColorIndex: index,
            color: selectedPalette.colors[index]
          }))
        }
        onCustomToggle={(groupId, enabled) =>
          updateGroup(groupId, (group) => {
            if (enabled) {
              return {
                ...group,
                customColorEnabled: true,
                customColor: group.color
              };
            }
            const index = Math.min(group.paletteColorIndex, selectedPalette.colors.length - 1);
            return {
              ...group,
              customColorEnabled: false,
              color: selectedPalette.colors[index]
            };
          })
        }
        onCustomColorChange={(groupId, value) =>
          updateGroup(groupId, (group) => ({
            ...group,
            customColor: value,
            color: validHexColor.test(value) ? value.toUpperCase() : group.color
          }))
        }
        onAddCountry={addCountryToGroup}
        onRemoveCountry={(groupId, countryId) =>
          updateGroup(groupId, (group) => ({
            ...group,
            countryIds: group.countryIds.filter((id) => id !== countryId)
          }))
        }
        onDeleteGroup={(groupId) =>
          setState((current) => (current.groups.length <= 1 ? current : { ...current, groups: current.groups.filter((group) => group.id !== groupId) }))
        }
      />
    </main>
  );
}

function nextGroupNumber(groups: Group[]): number {
  const used = new Set(
    groups
      .map((group) => /^Group (\d+)$/.exec(group.name.trim()))
      .filter((match): match is RegExpExecArray => Boolean(match))
      .map((match) => Number(match[1]))
  );
  let candidate = 1;
  while (used.has(candidate)) candidate += 1;
  return candidate;
}

function validateLongitude(value: string): string {
  if (value === "") return "Enter a longitude from -180 to 180.";
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= -180 && parsed <= 180 ? "" : "Enter a longitude from -180 to 180.";
}

function validateExportSize(width: number, height: number): string {
  const validWidth = Number.isInteger(width) && width >= 320 && width <= 7680;
  const validHeight = Number.isInteger(height) && height >= 180 && height <= 4320;
  return validWidth && validHeight ? "" : "Enter a valid image width and height.";
}
