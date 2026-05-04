// @/components/puck/ImgBlock.tsx
import Container from '@/components/layout/container';
import type { ComponentConfig } from '@puckeditor/core';
import { SlotPuck } from '../utils/slot-puck';

const systemColor = '#3b82f6';

export type ContainerBlockProps = {
  variant: '580' | '780' | '980' | '1280';
  slot: undefined;
};

export const ContainerBlock = (): ComponentConfig<ContainerBlockProps> => {
  // const { isEditing } = useEditorMode();

  return {
    fields: {
      variant: {
        type: 'custom',
        render: ({ value, onChange }) => {
          const options = [
            { label: '580px', value: '580' as const, width: 580 },
            { label: '780px', value: '780' as const, width: 780 },
            { label: '980px', value: '980' as const, width: 980 },
            { label: '1280px', value: '1280' as const, width: 1280 },
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: '#5A5A5A' }} className="text-sm font-semibold">
                Largura do Container
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    title={opt.label}
                    style={{
                      padding: '8px',
                      border: `2px solid ${value === opt.value ? systemColor : '#eee'}`,
                      borderRadius: '4px',
                      background: '#fff',
                      cursor: 'pointer',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: `${(opt.width / 1280) * 100}%`,
                        height: '24px',
                        background: value === opt.value ? systemColor : '#ddd',
                        borderRadius: '2px',
                        maxWidth: '90%',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        fontSize: '12px',
                        color: value === opt.value ? '#fff' : '#666',
                        fontWeight: value === opt.value ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        },
      },
      slot: {
        type: 'slot',
        disallow: ['Container'],
      },
    },
    defaultProps: {
      variant: '780',
      slot: [],
    },
    render: ({ variant, slot: Slot }) => {
      const maxWidthMap: Record<string, 580 | 780 | 980 | 1280> = {
        '580': 580,
        '780': 780,
        '980': 980,
        '1280': 1280,
      };

      return (
        <Container maxWidth={maxWidthMap[variant]} className="container-kelvin">
          <SlotPuck Slot={Slot} className="mx-auto w-full" />
        </Container>
      );
    },
  };
};
