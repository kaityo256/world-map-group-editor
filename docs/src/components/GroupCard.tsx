import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ColorPalette, Country, Group } from "../data/types";
import { CountrySearch, countryLabel } from "./CountrySearch";

type GroupCardProps = {
  group: Group;
  groups: Group[];
  countries: Country[];
  palette: ColorPalette;
  canDelete: boolean;
  onRename: (name: string) => void;
  onPaletteColorChange: (index: number) => void;
  onCustomToggle: (enabled: boolean) => void;
  onCustomColorChange: (value: string) => void;
  onAddCountry: (country: Country) => "added" | "duplicate-other" | "duplicate-same";
  onRemoveCountry: (countryId: string) => void;
  onDelete: () => void;
};

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

export function GroupCard({
  group,
  groups,
  countries,
  palette,
  canDelete,
  onRename,
  onPaletteColorChange,
  onCustomToggle,
  onCustomColorChange,
  onAddCountry,
  onRemoveCountry,
  onDelete
}: GroupCardProps) {
  const [pendingCountry, setPendingCountry] = useState<Country | undefined>();
  const [selectedAssignedId, setSelectedAssignedId] = useState<string | undefined>();
  const [warning, setWarning] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);

  const assignedCountries = useMemo(
    () =>
      group.countryIds
        .map((countryId) => countries.find((country) => country.id === countryId))
        .filter((country): country is Country => Boolean(country))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries, group.countryIds]
  );

  const customColorInvalid = group.customColorEnabled && !hexColorPattern.test(group.customColor);
  const selectedColorIndex = Math.min(group.paletteColorIndex, palette.colors.length - 1);

  useEffect(() => {
    if (assignedCountries.length === 1) {
      setSelectedAssignedId(assignedCountries[0].id);
      return;
    }
    if (selectedAssignedId && !assignedCountries.some((country) => country.id === selectedAssignedId)) {
      setSelectedAssignedId(undefined);
    }
  }, [assignedCountries, selectedAssignedId]);

  function handleAddCountry() {
    if (!pendingCountry) return;
    const result = onAddCountry(pendingCountry);
    if (result === "added") {
      setPendingCountry(undefined);
      setSearchResetKey((value) => value + 1);
      setWarning("");
      return;
    }
    setWarning(result === "duplicate-other" ? "This country is already assigned to another group." : "This country is already assigned to this group.");
  }

  function handleDelete() {
    if (group.countryIds.length > 0) {
      const confirmed = window.confirm("Delete this group?\nCountries assigned to this group will become unassigned.");
      if (!confirmed) return;
    }
    onDelete();
  }

  return (
    <section className="group-card" style={{ borderTopColor: group.color }}>
      <div className="group-card-header">
        <label className="field group-name-field">
          <span>Group Name</span>
          <input value={group.name} onChange={(event) => onRename(event.target.value)} />
        </label>
        <button type="button" className="icon-button danger-button" disabled={!canDelete} onClick={handleDelete} title="Delete Group" aria-label="Delete Group">
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="color-controls">
        <label className="field">
          <span>Color</span>
          <select disabled={group.customColorEnabled} value={selectedColorIndex} onChange={(event) => onPaletteColorChange(Number(event.target.value))}>
            {palette.colors.map((color, index) => (
              <option key={color} value={index}>
                {color}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-field">
          <input type="checkbox" checked={group.customColorEnabled} onChange={(event) => onCustomToggle(event.target.checked)} />
          <span>Custom</span>
        </label>
        <label className="field">
          <span>Custom Color</span>
          <input disabled={!group.customColorEnabled} value={group.customColor} onChange={(event) => onCustomColorChange(event.target.value)} />
        </label>
        <input
          aria-label="Custom color picker"
          className="color-picker"
          type="color"
          disabled={!group.customColorEnabled}
          value={hexColorPattern.test(group.customColor) ? group.customColor : group.color}
          onChange={(event) => onCustomColorChange(event.target.value.toUpperCase())}
        />
      </div>
      <div className="swatch-row">
        {palette.colors.map((color, index) => (
          <button
            type="button"
            className={`color-swatch ${!group.customColorEnabled && index === selectedColorIndex ? "active" : ""}`}
            key={color}
            style={{ backgroundColor: color }}
            disabled={group.customColorEnabled}
            title={color}
            aria-label={`Use color ${color}`}
            onClick={() => onPaletteColorChange(index)}
          />
        ))}
      </div>
      {customColorInvalid ? <div className="validation-message">Enter a valid color in #RRGGBB format.</div> : null}

      <div className="country-controls">
        <CountrySearch
          countries={countries}
          selectedCountry={pendingCountry}
          resetKey={searchResetKey}
          onSelect={(country) => {
            setPendingCountry(country);
            setWarning("");
          }}
          onQueryChange={() => setWarning("")}
        />
        <button type="button" className="icon-button" disabled={!pendingCountry} onClick={handleAddCountry} title="Add country" aria-label="Add country">
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
      {warning ? <div className="validation-message">{warning}</div> : null}

      <div className="assigned-section">
        <select className="assigned-list" size={Math.min(6, Math.max(3, assignedCountries.length || 3))} value={selectedAssignedId || ""} onChange={(event) => setSelectedAssignedId(event.target.value)}>
          {assignedCountries.map((country) => (
            <option key={country.id} value={country.id}>
              {countryLabel(country)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="icon-button"
          disabled={!selectedAssignedId}
          onClick={() => {
            if (!selectedAssignedId) return;
            onRemoveCountry(selectedAssignedId);
            setSelectedAssignedId(undefined);
          }}
          title="Remove country"
          aria-label="Remove country"
        >
          <Minus size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="assigned-count">{assignedCountries.length} assigned</div>
      <span className="sr-only">{groups.length} groups available</span>
    </section>
  );
}
