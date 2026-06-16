/**
 * Shared color picker surface for text color and highlight pickers.
 */
import { Button } from '@/components/ui/button';
import { ColorPickerField } from '@/editor/components/color-picker-field';

type ColorPaletteProps = {
  title: string;
  colors: string[];
  removeLabel: string;
  value: string;
  onChange: (color: string) => void;
  // onSelect: (color: string) => void;
  onRemove: () => void;
};

export function ColorPalette({
  title,
  colors,
  removeLabel,
  value,
  onChange,
  // onSelect,
  onRemove,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-col gap-3 px-2 py-2">
      <span className="text-[10px] font-bold uppercase text-slate-400">{title}</span>
      <ColorPickerField
        value={value}
        onChange={onChange}
        enableGradient={false}
        allowColorTypeToggle={false}
        showPresets={true}
        presets={colors}
        width={280}
        height={100}
      />
      <Button variant="link" size="sm" className="h-6 w-fit p-0 text-[10px]" onClick={onRemove}>
        {removeLabel}
      </Button>
    </div>
  );
}
