import { Download } from "lucide-react";
import type { ExportSizeMode } from "../data/types";

export const exportSizePresets: Record<Exclude<ExportSizeMode, "custom">, { label: string; width: number; height: number }> = {
  small: { label: "Small", width: 1280, height: 720 },
  middle: { label: "Middle", width: 1920, height: 1080 },
  large: { label: "Large", width: 3840, height: 2160 }
};

type ExportControlsProps = {
  transparentBackground: boolean;
  exportSizeMode: ExportSizeMode;
  customExportWidth: number;
  customExportHeight: number;
  customSizeError?: string;
  onTransparentChange: (enabled: boolean) => void;
  onSizeModeChange: (mode: ExportSizeMode) => void;
  onCustomWidthChange: (value: number) => void;
  onCustomHeightChange: (value: number) => void;
  onSave: () => void;
};

export function ExportControls({
  transparentBackground,
  exportSizeMode,
  customExportWidth,
  customExportHeight,
  customSizeError,
  onTransparentChange,
  onSizeModeChange,
  onCustomWidthChange,
  onCustomHeightChange,
  onSave
}: ExportControlsProps) {
  const customDisabled = exportSizeMode !== "custom";

  return (
    <div className="export-controls">
      <label className="inline-field">
        <input type="checkbox" checked={transparentBackground} onChange={(event) => onTransparentChange(event.target.checked)} />
        <span>Transparent background</span>
      </label>
      <label className="field">
        <span>Image Size</span>
        <select value={exportSizeMode} onChange={(event) => onSizeModeChange(event.target.value as ExportSizeMode)}>
          <option value="small">Small (1280 x 720)</option>
          <option value="middle">Middle (1920 x 1080)</option>
          <option value="large">Large (3840 x 2160)</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      <label className="field compact-field">
        <span>Width</span>
        <input type="number" min="320" max="7680" step="1" disabled={customDisabled} value={customExportWidth} onChange={(event) => onCustomWidthChange(Number(event.target.value))} />
      </label>
      <label className="field compact-field">
        <span>Height</span>
        <input type="number" min="180" max="4320" step="1" disabled={customDisabled} value={customExportHeight} onChange={(event) => onCustomHeightChange(Number(event.target.value))} />
      </label>
      <button type="button" className="primary-button" onClick={onSave} disabled={Boolean(customSizeError)}>
        <Download size={18} aria-hidden="true" />
        <span>Save As</span>
      </button>
      {customSizeError ? <div className="validation-message">{customSizeError}</div> : null}
    </div>
  );
}
