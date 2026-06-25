import type { ColorPalette, Country, Group } from "../data/types";
import { GroupCard } from "./GroupCard";

type GroupEditorProps = {
  groups: Group[];
  countries: Country[];
  palette: ColorPalette;
  onAddGroup: () => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onPaletteColorChange: (groupId: string, index: number) => void;
  onCustomToggle: (groupId: string, enabled: boolean) => void;
  onCustomColorChange: (groupId: string, value: string) => void;
  onAddCountry: (groupId: string, country: Country) => "added" | "duplicate-other" | "duplicate-same";
  onRemoveCountry: (groupId: string, countryId: string) => void;
  onDeleteGroup: (groupId: string) => void;
};

export function GroupEditor({
  groups,
  countries,
  palette,
  onAddGroup,
  onRenameGroup,
  onPaletteColorChange,
  onCustomToggle,
  onCustomColorChange,
  onAddCountry,
  onRemoveCountry,
  onDeleteGroup
}: GroupEditorProps) {
  return (
    <section className="group-editor" aria-label="Group editor">
      <div className="editor-header">
        <h2>Groups</h2>
        <button type="button" className="secondary-button" onClick={onAddGroup}>
          Add Group
        </button>
      </div>
      <div className="group-grid">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            groups={groups}
            countries={countries}
            palette={palette}
            canDelete={groups.length > 1}
            onRename={(name) => onRenameGroup(group.id, name)}
            onPaletteColorChange={(index) => onPaletteColorChange(group.id, index)}
            onCustomToggle={(enabled) => onCustomToggle(group.id, enabled)}
            onCustomColorChange={(value) => onCustomColorChange(group.id, value)}
            onAddCountry={(country) => onAddCountry(group.id, country)}
            onRemoveCountry={(countryId) => onRemoveCountry(group.id, countryId)}
            onDelete={() => onDeleteGroup(group.id)}
          />
        ))}
      </div>
    </section>
  );
}
