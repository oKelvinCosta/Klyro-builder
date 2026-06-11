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
import { ColorPickerField } from '@/editor/components/color-picker-field';
import { useThemeStore, type CanvasTheme } from '@/editor/stores/use-canvas-theme-store';
import { usePageUpdater } from '@/pages/puck/hooks/use-page-updater';
import { Palette, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { FontPicker } from './font-picker';

function hslToRgba(hslStr: string): string {
  if (!hslStr) return 'rgba(0,0,0,1)';
  const parts = hslStr.replace(/%/g, '').trim().split(/\s+/);
  if (parts.length < 3) return 'rgba(0,0,0,1)';

  const h = Number(parts[0]);
  const s = Number(parts[1]) / 100;
  const l = Number(parts[2]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);

  return `rgba(${red},${green},${blue},1)`;
}

function rgbaToHsl(rgba: string): string {
  const match = rgba.match(
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)/
  );
  if (!match) return '0 0% 0%';

  const r = Number(match[1]) / 255;
  const g = Number(match[2]) / 255;
  const b = Number(match[3]) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

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
 * COMPONENT: ColorField
 * Individual row containing a label, color picker, and hex text input.
 * Defined outside to avoid re-mounting on parent re-renders.
 */
interface ColorFieldProps {
  label: string;
  id: keyof CanvasTheme;
  localTheme: CanvasTheme;
  handleChange: (key: keyof CanvasTheme, value: string) => void;
}

const ColorField = ({ label, id, localTheme, handleChange }: ColorFieldProps) => {
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
      <ColorPickerField
        value={hslToRgba(localTheme[id] as string)}
        onChange={(color) => handleChange(id, rgbaToHsl(color))}
      />
    </div>
  );
};

/**
 * MAIN COMPONENT: ThemePanel
 * The main sidebar panel that manages theme editing.
 */
export function ThemePanel() {
  const { theme, setTheme, resetTheme } = useThemeStore();
  const { updatePage } = usePageUpdater();

  // localTheme holds the "draft" of the theme before it's applied to the global store
  const [localTheme, setLocalTheme] = useState<CanvasTheme>(theme);

  // Sync draft theme when the global store changes (e.g., on manual reset)
  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleChange = (key: keyof CanvasTheme, value: string) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setTheme(localTheme); // Apply changes to the Canvas
    // Persist theme to the backend
    updatePage.mutate({ project: { theme: localTheme } } as any);
  };

  // Shared props to pass to all ColorField instances
  const commonProps = {
    localTheme,
    handleChange,
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
