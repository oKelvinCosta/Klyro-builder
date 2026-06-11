import { cn } from '@/lib/utils';
import { useEffect, useId, useState } from 'react';
import ColorPickerLib from 'react-best-gradient-color-picker';

export type ColorPickerFieldProps = {
  value: string;
  onChange: (color: string) => void;
  enableGradient?: boolean;
  allowColorTypeToggle?: boolean;
  showPresets?: boolean;
  showOpacity?: boolean;
  showEyeDropper?: boolean;
  presets?: string[];
  showColorGuide?: boolean;
  width?: number;
  height?: number;
  disabled?: boolean;
  className?: string;
};

export function ColorPickerField({
  value,
  onChange,
  enableGradient = false,
  allowColorTypeToggle = false,
  showPresets = false,
  showOpacity = false,
  showEyeDropper = true,
  presets,
  showColorGuide = false,
  width = 280,
  height = 100,
  disabled = false,
  className,
}: ColorPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const pickerId = useId();

  // We use a hybrid controlled/uncontrolled approach (local state + prop sync)
  // to ensure the UI updates instantly when the user drags the color picker.
  // Relying solely on the parent's `value` can cause lag or visual bugs if the 
  // editor takes time to process the transaction and echo the new color back.
  const [localValue, setLocalValue] = useState(value);

  // Sync with parent's value when it changes (e.g., user clicks on a text with a different color)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle user interaction: update the local preview instantly, and notify the parent
  const handleColorChange = (newColor: string) => {
    setLocalValue(newColor);
    onChange(newColor);
  };

  useEffect(() => {
    if (!enableGradient && localValue?.includes('gradient')) {
      handleColorChange('rgba(0,0,0,1)');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableGradient, localValue]);

  if (disabled) {
    return (
      <div
        className={cn('rounded-md border border-white/10', className)}
        style={{
          width,
          height,
          background: localValue,
          opacity: 0.5,
        }}
      />
    );
  }

  const previewStyle = {
    background: localValue,
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className={cn(
          'border-input bg-background hover:bg-accent/40 flex h-9 w-full items-center gap-3 rounded-md border px-3 text-left text-sm shadow-sm transition-colors'
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={pickerId}
      >
        <span
          className="h-5 w-5 shrink-0 rounded-sm border border-white/20 shadow-sm"
          style={previewStyle}
        />
        <span className="text-muted-foreground flex-1 truncate font-mono text-xs">{localValue}</span>
        <span className="text-muted-foreground text-[10px] uppercase tracking-widest">
          {open ? 'Fechar' : 'Abrir'}
        </span>
      </button>

      {open && (
        <div
          id={pickerId}
          className="border-border bg-background relative left-0 top-[calc(100%+8px)] z-50 mt-2 flex justify-center rounded-lg border bg-white p-2 py-4 shadow-xl"
        >
          <ColorPickerLib
            value={localValue}
            onChange={handleColorChange}
            width={width}
            height={height}
            presets={presets}
            hideColorGuide={!showColorGuide}
            hideInputs={false}
            hideOpacity={!showOpacity}
            hidePresets={!showPresets}
            hideEyeDrop={!showEyeDropper}
            hideColorTypeBtns={!allowColorTypeToggle}
            hideGradientControls={!enableGradient}
            hideGradientType={!enableGradient}
            hideGradientAngle={!enableGradient}
            hideGradientStop={!enableGradient}
            disableDarkMode
          />
        </div>
      )}
    </div>
  );
}
