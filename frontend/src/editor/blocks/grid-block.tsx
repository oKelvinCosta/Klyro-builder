// @/components/puck/ImgBlock.tsx
import { Button } from '@/components/ui/button';
import type { ContainerVariant } from '@/editor/fields';
import * as Fields from '@/editor/fields';
import { type ComponentConfig } from '@puckeditor/core';
import { Monitor, Smartphone, Tablet, XCircle } from 'lucide-react';
import { SlotPuck } from '../utils/slot-puck';
import { borderColor, checkedColor, inputColor, inputForegroundColor } from '../utils/styles';

export type GridBlockProps = {
  columnFormat: '1/1' | '1/2-1/2' | '1/3-2/3' | '2/3-1/3' | '1/3-1/3-1/3' | '1/4-1/4-1/4-1/4';
  alignmentY: 'top' | 'center' | 'bottom';
  mobileBreakpoint: 'never' | 'sm' | 'md' | 'lg';
  'col-1': any; // eslint-disable-line @typescript-eslint/no-explicit-any
  'col-2': any; // eslint-disable-line @typescript-eslint/no-explicit-any
  'col-3': any; // eslint-disable-line @typescript-eslint/no-explicit-any
  'col-4': any; // eslint-disable-line @typescript-eslint/no-explicit-any;
  container: ContainerVariant;
};

const defaultAlignmentY = 'center' satisfies GridBlockProps['alignmentY'];

export const GridBlock = (): ComponentConfig<GridBlockProps> => {
  // const { isEditing } = useEditorMode();

  return {
    fields: {
      columnFormat: {
        label: 'Layout colunas',
        type: 'custom',
        render: ({ value, onChange }) => {
          const options = [
            { label: '1/1', value: '1/1', layout: [12] },
            { label: '1/2 1/2', value: '1/2-1/2', layout: [6, 6] },
            { label: '1/3 2/3', value: '1/3-2/3', layout: [4, 8] },
            { label: '2/3 1/3', value: '2/3-1/3', layout: [8, 4] },
            { label: '1/3 1/3 1/3', value: '1/3-1/3-1/3', layout: [4, 4, 4] },
            { label: '1/4 1/4 1/4 1/4', value: '1/4-1/4-1/4-1/4', layout: [3, 3, 3, 3] },
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="text-sm font-semibold">Layout</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange(opt.value as GridBlockProps['columnFormat'])}
                    title={opt.label}
                    style={{
                      padding: '4px',
                      border: `1px solid ${value === opt.value ? checkedColor : borderColor}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      height: '32px',
                      display: 'flex',
                      gap: '2px',
                    }}
                  >
                    {opt.layout.map((w, i) => (
                      <div
                        key={i}
                        style={{
                          flex: w,
                          backgroundColor:
                            value === opt.value ? checkedColor : inputForegroundColor,
                          borderRadius: '2px',
                        }}
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>
          );
        },
      },
      alignmentY: Fields.AlignmentYField({ defaultValue: 'center' }),
      mobileBreakpoint: {
        label: 'Quebrar para 1 coluna em:',
        type: 'custom',
        render: ({ value, onChange }) => {
          const options = [
            { label: 'Nunca', value: 'never', icon: XCircle },
            { label: 'Mobile', value: 'sm', icon: Smartphone },
            { label: 'Tablet', value: 'md', icon: Tablet },
            { label: 'Desktop', value: 'lg', icon: Monitor },
          ];

          // Se não houver valor (componente antigo ou inicialização), usa o padrão 'md'
          const currentValue = value || 'md';

          return (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Quebra de Coluna</span>
              <div className="grid grid-cols-4 gap-4">
                {options.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = currentValue === opt.value;
                  return (
                    <Button
                      key={opt.value}
                      onClick={() => onChange(opt.value as GridBlockProps['mobileBreakpoint'])}
                      title={opt.label}
                      variant="outline"
                      style={{
                        border: `1px solid ${isActive ? checkedColor : borderColor}`,
                        borderRadius: '6px',
                        background: inputColor,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        height: 'auto',
                      }}
                      className="py-3"
                    >
                      <Icon size={16} color={isActive ? checkedColor : inputForegroundColor} />
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? checkedColor : inputForegroundColor,
                        }}
                      >
                        {opt.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        },
      },

      'col-1': {
        type: 'slot',
        disallow: ['Container'],
      },
      'col-2': {
        type: 'slot',
        disallow: ['Container'],
      },
      'col-3': {
        type: 'slot',
        disallow: ['Container'],
      },
      'col-4': {
        type: 'slot',
        disallow: ['Container'],
      },
      container: Fields.ContainerField(),
    },
    defaultProps: {
      columnFormat: '1/2-1/2',
      alignmentY: defaultAlignmentY,
      mobileBreakpoint: 'md',
      'col-1': [],
      'col-2': [],
      'col-3': [],
      'col-4': [],
      container: '980',
    },
    render: ({
      columnFormat,
      alignmentY,
      mobileBreakpoint,
      'col-1': Col1,
      'col-2': Col2,
      'col-3': Col3,
      'col-4': Col4,
      container,
    }) => {
      // Mapeamento explícito para o Tailwind não remover as classes (Purge CSS)
      const containerBreakpoints: Record<string, string> = {
        never: 'grid-cols-12',
        sm: 'grid-cols-1 sm:grid-cols-12',
        md: 'grid-cols-1 md:grid-cols-12',
        lg: 'grid-cols-1 lg:grid-cols-12',
      };

      const gridConfigs = {
        '1/1': {
          containerClass: 'grid grid-cols-1 gap-6',
          spans: {
            never: ['col-span-12'],
            sm: ['sm:col-span-12'],
            md: ['md:col-span-12'],
            lg: ['lg:col-span-12'],
          },
          slots: [Col1],
        },
        '1/2-1/2': {
          containerClass: `grid ${containerBreakpoints[mobileBreakpoint]} gap-6`,
          spans: {
            never: ['col-span-6', 'col-span-6'],
            sm: ['sm:col-span-6', 'sm:col-span-6'],
            md: ['md:col-span-6', 'md:col-span-6'],
            lg: ['lg:col-span-6', 'lg:col-span-6'],
          },
          slots: [Col1, Col2],
        },
        '1/3-2/3': {
          containerClass: `grid ${containerBreakpoints[mobileBreakpoint]} gap-6`,
          spans: {
            never: ['col-span-4', 'col-span-8'],
            sm: ['sm:col-span-4', 'sm:col-span-8'],
            md: ['md:col-span-4', 'md:col-span-8'],
            lg: ['lg:col-span-4', 'lg:col-span-8'],
          },
          slots: [Col1, Col2],
        },
        '2/3-1/3': {
          containerClass: `grid ${containerBreakpoints[mobileBreakpoint]} gap-6`,
          spans: {
            never: ['col-span-8', 'col-span-4'],
            sm: ['sm:col-span-8', 'sm:col-span-4'],
            md: ['md:col-span-8', 'md:col-span-4'],
            lg: ['lg:col-span-8', 'lg:col-span-4'],
          },
          slots: [Col1, Col2],
        },
        '1/3-1/3-1/3': {
          containerClass: `grid ${containerBreakpoints[mobileBreakpoint]} gap-6`,
          spans: {
            never: ['col-span-4', 'col-span-4', 'col-span-4'],
            sm: ['sm:col-span-4', 'sm:col-span-4', 'sm:col-span-4'],
            md: ['md:col-span-4', 'md:col-span-4', 'md:col-span-4'],
            lg: ['lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4'],
          },
          slots: [Col1, Col2, Col3],
        },
        '1/4-1/4-1/4-1/4': {
          containerClass: `grid ${containerBreakpoints[mobileBreakpoint]} gap-6`,
          spans: {
            never: ['col-span-3', 'col-span-3', 'col-span-3', 'col-span-3'],
            sm: ['sm:col-span-3', 'sm:col-span-3', 'sm:col-span-3', 'sm:col-span-3'],
            md: ['md:col-span-3', 'md:col-span-3', 'md:col-span-3', 'md:col-span-3'],
            lg: ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-3'],
          },
          slots: [Col1, Col2, Col3, Col4],
        },
      };

      const config =
        gridConfigs[columnFormat as keyof typeof gridConfigs] || gridConfigs['1/2-1/2'];

      const alignmentYClasses = {
        top: 'items-start',
        center: 'items-center',
        bottom: 'items-end',
      };

      return (
        <div
          className={`mx-auto ${config.containerClass} ${alignmentYClasses[alignmentY]}`}
          style={{
            maxWidth: Fields.CONTAINER_MAP[container].maxWidth,
          }}
        >
          {config.slots.map((Slot, index) => {
            const spanClass = config.spans[mobileBreakpoint as keyof typeof config.spans][index];
            return (
              <div key={index} className={spanClass}>
                <SlotPuck Slot={Slot} className="gap-6" />
              </div>
            );
          })}
        </div>
      );
    },
  };
};
