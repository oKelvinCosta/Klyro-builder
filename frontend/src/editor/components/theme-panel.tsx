import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCanvasThemeStore, type CanvasTheme } from '@/editor/stores/use-canvas-theme-store';
import { Palette, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { FontPicker } from './font-picker';

/**
 * UTILS: Color Conversion Functions
 * These helpers manage the translation between Hex (UI), HSL (Store/CSS),
 * and various user input formats.
 */

/**
 * Converts a Hex color string (#RRGGBB) to a Shadcn-compatible HSL string ("H S% L%").
 * Used when the user selects a color via the native <input type="color">.
 */
function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

/**
 * Converts a Shadcn-style HSL string ("H S% L%") back to Hex (#RRGGBB).
 * Used to display the current color in the native color picker and text inputs.
 */
function hslToHex(hslStr: string): string {
  if (!hslStr) return '#000000';
  const parts = hslStr.split(' ');
  if (parts.length < 3) return '#000000';

  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1].replace('%', '')) / 100;
  const l = parseFloat(parts[2].replace('%', '')) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Smart parser that identifies if an input string is Hex or HSL.
 * Allows users to paste various formats while normalizing them to the Store format.
 */
function parseAnyColorToHsl(input: string): string | null {
  const trimmed = input.trim();

  // 1. Check for Hex formats (#FFF, #FFFFFF, or just FFFFFF)
  if (trimmed.startsWith('#') || /^[0-9a-fA-F]{3,6}$/.test(trimmed)) {
    const hex = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      return hexToHsl(hex);
    }
  }

  // 2. Check for HSL space-separated format (e.g., "200 50 50" or "200 50% 50%")
  const hslParts = trimmed.replace(/%/g, '').split(/\s+/);
  if (hslParts.length === 3) {
    const h = parseFloat(hslParts[0]);
    const s = parseFloat(hslParts[1]);
    const l = parseFloat(hslParts[2]);
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
    }
  }

  return null;
}

/**
 * COMPONENT: ColorField
 * Individual row containing a label, color picker, and hex text input.
 * Defined outside to avoid re-mounting on parent re-renders.
 */
interface ColorFieldProps {
  label: string;
  id: keyof CanvasTheme;
  localTheme: CanvasTheme;
  handleChange: (key: keyof CanvasTheme, value: string) => void;
  handleColorChange: (key: keyof CanvasTheme, hex: string) => void;
}

const ColorField = ({
  label,
  id,
  localTheme,
  handleChange,
  handleColorChange,
}: ColorFieldProps) => {
  // inputValue tracks the text shown in the Hex input (independent of the store format)
  const [inputValue, setInputValue] = useState(hslToHex(localTheme[id] as string));

  // Sync input value when localTheme changes (e.g., when clicking the color picker or resetting)
  useEffect(() => {
    setInputValue(hslToHex(localTheme[id] as string));
  }, [localTheme, id]);

  const handleTextChange = (val: string) => {
    setInputValue(val);
    const hsl = parseAnyColorToHsl(val);
    if (hsl) {
      handleChange(id, hsl); // Update local state only if valid color detected
    }
  };

  const handleBlur = () => {
    // Ensure the input always displays a valid Hex when focus is lost
    setInputValue(hslToHex(localTheme[id] as string));
  };

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className={cn(
          'text-muted-foreground',
          'text-[11px]',
          'font-medium',
          'uppercase',
          'tracking-wider'
        )}
      >
        {label}
      </Label>
      <div className={cn('flex', 'gap-2')}>
        {/* Native Color Picker */}
        <Input
          id={id}
          type="color"
          className={cn('size-8', 'shrink-0', 'cursor-pointer', 'p-0.5')}
          value={hslToHex(localTheme[id] as string)}
          onChange={(e) => handleColorChange(id, e.target.value)}
        />
        {/* Hex/HSL Text Input */}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={handleBlur}
          className={cn('h-8', 'font-mono', 'text-xs')}
          placeholder="#000000 ou H S L"
        />
      </div>
    </div>
  );
};

/**
 * MAIN COMPONENT: CanvasThemePanel
 * The main sidebar panel that manages theme editing.
 */
export function CanvasThemePanel() {
  const { theme, setTheme, resetTheme } = useCanvasThemeStore();

  // localTheme holds the "draft" of the theme before it's applied to the global store
  const [localTheme, setLocalTheme] = useState<CanvasTheme>(theme);

  // Sync draft theme when the global store changes (e.g., on manual reset)
  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  // Memoized handlers to keep props stable for ColorField
  const handleChange = (key: keyof CanvasTheme, value: string) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (key: keyof CanvasTheme, hex: string) => {
    handleChange(key, hexToHsl(hex));
  };

  const handleSave = () => {
    setTheme(localTheme); // Apply changes to the Canvas
  };

  // Shared props to pass to all ColorField instances
  const commonProps = {
    localTheme,
    handleChange,
    handleColorChange,
  };

  return (
    <div className={cn('bg-background/50', 'flex', 'h-full', 'flex-col')}>
      {/* Panel Header */}
      <div className={cn('flex', 'items-center', 'gap-2', 'border-b', 'border-white/5', 'p-4')}>
        <Palette className={cn('text-primary', 'size-4')} />
        <h3
          className={cn(
            'text-muted-foreground',
            'mb-0',
            'text-xs',
            'font-bold',
            'uppercase',
            'tracking-widest'
          )}
        >
          Configurações de Tema
        </h3>
      </div>

      {/* Main Content Area: Grouped Settings in Accordions */}
      <div className={cn('flex-1', 'space-y-6', 'overflow-y-auto', 'p-4', '[&_h3]:mb-0')}>
        <Accordion
          type="multiple"
          defaultValue={['base', 'brand']}
          className={cn('w-full', 'space-y-2')}
        >
          {/* Base Background & Foreground Colors */}
          <AccordionItem value="base" className="border-white/5">
            <AccordionTrigger
              className={cn('py-2', 'text-xs', 'font-semibold', 'hover:no-underline')}
            >
              Cores Base
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <ColorField label="Fundo" id="background" {...commonProps} />
              <ColorField label="Texto Principal" id="foreground" {...commonProps} />
              <ColorField label="Card" id="card" {...commonProps} />
              <ColorField label="Texto do Card" id="card-foreground" {...commonProps} />
            </AccordionContent>
          </AccordionItem>

          {/* Components and buttons */}
          <AccordionItem value="components" className="border-white/5">
            <AccordionTrigger
              className={cn('py-2', 'text-xs', 'font-semibold', 'hover:no-underline')}
            >
              Componentes e Botões
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <ColorField label="Primária" id="primary" {...commonProps} />
              <ColorField label="Texto sobre Primária" id="primary-foreground" {...commonProps} />
              <ColorField label="Secundária" id="secondary" {...commonProps} />
              <ColorField
                label="Texto sobre Secundária"
                id="secondary-foreground"
                {...commonProps}
              />
              <ColorField label="Terciária" id="tertiary" {...commonProps} />
              <ColorField label="Texto sobre Terciária" id="tertiary-foreground" {...commonProps} />
            </AccordionContent>
          </AccordionItem>

          {/* Feedback & UI Status Colors */}
          <AccordionItem value="status" className="border-white/5">
            <AccordionTrigger
              className={cn('py-2', 'text-xs', 'font-semibold', 'hover:no-underline')}
            >
              Status
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <ColorField label="Sucesso" id="success" {...commonProps} />
              <ColorField label="Erro" id="destructive" {...commonProps} />
              {/* <ColorField label="Muted" id="muted" {...commonProps} />
              <ColorField label="Accent" id="accent" {...commonProps} /> */}
            </AccordionContent>
          </AccordionItem>

          {/* Layout, Borders & Spacing */}
          <AccordionItem value="layout" className="border-white/5">
            <AccordionTrigger
              className={cn('py-2', 'text-xs', 'font-semibold', 'hover:no-underline')}
            >
              Bordas e Layout
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <ColorField label="Borda" id="border" {...commonProps} />
              <ColorField label="Input" id="input" {...commonProps} />
              <ColorField label="Anel de Foco" id="ring" {...commonProps} />
              <div className="space-y-1.5">
                <Label
                  htmlFor="radius"
                  className={cn(
                    'text-muted-foreground',
                    'text-[11px]',
                    'font-medium',
                    'uppercase',
                    'tracking-wider'
                  )}
                >
                  Bordas Arredondadas (Radius)
                </Label>
                <Input
                  id="radius"
                  type="text"
                  value={localTheme.radius}
                  onChange={(e) => handleChange('radius', e.target.value)}
                  className={cn('h-8', 'text-xs')}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Font Family Configuration */}
          <AccordionItem value="typography" className="border-white/5">
            <AccordionTrigger
              className={cn('py-2', 'text-xs', 'font-semibold', 'hover:no-underline')}
            >
              Tipografia
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="title-font"
                  className={cn(
                    'text-muted-foreground',
                    'text-[11px]',
                    'font-medium',
                    'uppercase',
                    'tracking-wider'
                  )}
                >
                  Fonte de Título
                </Label>
                <FontPicker
                  id="title-font"
                  value={localTheme['title-font-family']}
                  onChange={(val) => handleChange('title-font-family', val)}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="title-font-weight"
                  className={cn(
                    'text-muted-foreground',
                    'text-[11px]',
                    'font-medium',
                    'uppercase',
                    'tracking-wider'
                  )}
                >
                  Peso do Título
                </Label>
                <Select
                  value={localTheme['title-font-weight']}
                  onValueChange={(val) => handleChange('title-font-weight', val)}
                >
                  <SelectTrigger id="title-font-weight" className={cn('h-8', 'text-xs')}>
                    <SelectValue placeholder="Peso da fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100" className="text-xs">
                      100 - Thin
                    </SelectItem>
                    <SelectItem value="200" className="text-xs">
                      200 - Extra Light
                    </SelectItem>
                    <SelectItem value="300" className="text-xs">
                      300 - Light
                    </SelectItem>
                    <SelectItem value="400" className="text-xs">
                      400 - Regular
                    </SelectItem>
                    <SelectItem value="500" className="text-xs">
                      500 - Medium
                    </SelectItem>
                    <SelectItem value="600" className="text-xs">
                      600 - Semi Bold
                    </SelectItem>
                    <SelectItem value="700" className="text-xs">
                      700 - Bold
                    </SelectItem>
                    <SelectItem value="800" className="text-xs">
                      800 - Extra Bold
                    </SelectItem>
                    <SelectItem value="900" className="text-xs">
                      900 - Black
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="text-font"
                  className={cn(
                    'text-muted-foreground',
                    'text-[11px]',
                    'font-medium',
                    'uppercase',
                    'tracking-wider'
                  )}
                >
                  Fonte de Texto
                </Label>
                <FontPicker
                  id="text-font"
                  value={localTheme['text-font-family']}
                  onChange={(val) => handleChange('text-font-family', val)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Additional Custom Colors */}
          <AccordionItem value="extra" className="border-white/5">
            <AccordionTrigger
              className={cn('py-2', 'text-xs', 'font-semibold', 'hover:no-underline')}
            >
              Paleta de Cores
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className={cn('text-muted-foreground', 'text-[11px]', 'font-medium')}>
                *Aparecerá no color picker dos componentes
              </p>
              <ColorField label="Cor Extra 1" id="extra-color-1" {...commonProps} />
              <ColorField label="Cor Extra 2" id="extra-color-2" {...commonProps} />
              <ColorField label="Cor Extra 3" id="extra-color-3" {...commonProps} />
              <ColorField label="Cor Extra 4" id="extra-color-4" {...commonProps} />
              <ColorField label="Cor Extra 5" id="extra-color-5" {...commonProps} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer Actions: Reset and Apply Changes */}
      <div
        className={cn(
          'bg-background/80',
          'sticky',
          'bottom-0',
          'border-t',
          'border-white/5',
          'p-4',
          'backdrop-blur-sm'
        )}
      >
        <div className={cn('grid', 'grid-cols-2', 'gap-2')}>
          <Button variant="muted" size="sm" onClick={resetTheme} className={cn('h-9', 'text-xs')}>
            <RotateCcw className={cn('mr-2', 'size-3.5')} />
            Resetar
          </Button>
          <Button
            variant="neon"
            size="sm"
            onClick={handleSave}
            disabled={JSON.stringify(localTheme) === JSON.stringify(theme)}
            className={cn('h-9', 'text-xs')}
          >
            <Save className={cn('mr-2', 'size-3.5')} />
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
