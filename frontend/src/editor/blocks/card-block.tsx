// @/components/puck/ImgBlock.tsx
import Container from '@/components/layout/container';
import MainCard from '@/components/main-card';
import { CONTAINER_MAP, type ContainerVariant } from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';

export type CardBlockProps = {
  imgSrc?: string;
  title?: string;
  horizontal?: boolean;
  side?: 'left' | 'right';
  content?: React.ReactNode;
  textSize?: 16 | 18 | 24;
  variant?: 'default' | 'gray';
  container?: ContainerVariant;
  slot?: React.ReactNode;
};

export const CardBlock: ComponentConfig<CardBlockProps> = {
  fields: {
    imgSrc: { type: 'text' },
    title: { type: 'text' },
    horizontal: {
      type: 'radio',
      options: [
        { label: 'Vertical', value: false },
        { label: 'Horizontal', value: true },
      ],
    },
    side: {
      type: 'radio',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    content: {
      type: 'richtext',
    },
    textSize: {
      type: 'radio',
      options: [
        { label: 'Small', value: 16 },
        { label: 'Medium', value: 18 },
        { label: 'Large', value: 24 },
      ],
    },
    variant: {
      type: 'radio',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Gray', value: 'gray' },
      ],
    },
    container: {
      type: 'custom',
      render: ({ value, onChange }) => {
        const options = Object.entries(CONTAINER_MAP).map(([key, item]) => ({
          value: key as ContainerVariant,
          label: item.label,
        }));

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="text-label-puck text-sm font-semibold">Largura do Container</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {options.map((opt) => {
                const previewWidth =
                  opt.value === 'full' ? '100%' : `${(Number(opt.value) / 1280) * 100}%`;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    title={opt.label}
                    type="button"
                    style={{
                      padding: '8px',
                      border: `2px solid ${value === opt.value ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <div
                      style={{
                        width: previewWidth,
                        height: '24px',
                        borderRadius: '2px',
                        maxWidth: '90%',
                      }}
                      className={`${value === opt.value ? 'bg-primary' : 'bg-muted'}`}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        fontSize: '12px',
                        fontWeight: value === opt.value ? 600 : 400,
                      }}
                      className={`${value === opt.value ? 'text-primary-foreground' : ''}`}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      },
    },
    slot: {
      type: 'slot',
    },
  },
  defaultProps: {
    title: 'Card Title',
    content: 'Card content goes here...',
    horizontal: false,
    side: 'left',
    textSize: 16,
    variant: 'default',
    container: '980' as ContainerVariant,
    imgSrc: '',
    slot: [],
  },
  render: ({
    imgSrc,
    title,
    horizontal,
    side,
    content,
    textSize,
    variant,
    container,
    slot: _slot,
  }) => {
    return (
      <Container
        style={{
          maxWidth: CONTAINER_MAP[container as ContainerVariant].maxWidth,
        }}
      >
        <MainCard
          imgSrc={imgSrc || undefined}
          title={title}
          horizontal={horizontal}
          side={side}
          textSize={textSize}
          variant={variant}
        >
          {content}
          {/* {Slot ? <SlotPuck Slot={Slot as React.ElementType} style={{ gap: '2rem' }} /> : ''} */}
        </MainCard>
      </Container>
    );
  },
};
