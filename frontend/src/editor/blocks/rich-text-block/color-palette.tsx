/**
 * Shared grid of color swatches for text color and highlight pickers.
 */
import { Button } from '@/components/ui/button';

type ColorPaletteProps = {
  title: string;
  colors: string[];
  removeLabel: string;
  onSelect: (color: string) => void;
  onRemove: () => void;
};

export function ColorPalette({ title, colors, removeLabel, onSelect, onRemove }: ColorPaletteProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <span className="text-[10px] font-bold uppercase text-slate-400">{title}</span>
      <div className="grid grid-cols-9 gap-4">
        {colors.map((color, index) => (
          <button
            key={`${color}-${index}`}
            className="h-5 w-5 rounded-sm border border-white shadow-sm transition-transform hover:scale-110"
            style={{ background: color }}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>
      <Button variant="link" size="sm" className="h-6 w-fit p-0 text-[10px]" onClick={onRemove}>
        {removeLabel}
      </Button>
    </div>
  );
}
