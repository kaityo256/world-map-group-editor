import type { ColorPalette } from "../data/types";

type ColorPaletteSelectorProps = {
  palettes: ColorPalette[];
  selectedPaletteId: string;
  onChange: (paletteId: ColorPalette["id"]) => void;
};

export function ColorPaletteSelector({ palettes, selectedPaletteId, onChange }: ColorPaletteSelectorProps) {
  return (
    <label className="field">
      <span>Color Palette</span>
      <select value={selectedPaletteId} onChange={(event) => onChange(event.target.value as ColorPalette["id"])}>
        {palettes.map((palette) => (
          <option key={palette.id} value={palette.id}>
            {palette.name}
          </option>
        ))}
      </select>
    </label>
  );
}
