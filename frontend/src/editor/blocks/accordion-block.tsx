import AccordionContained from '@/components/accordion-contained';
import Img from '@/components/img';
import { CONTAINER_MAP, type ContainerVariant } from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';

/**
 * Props for the AccordionBlock component
 */
export type AccordionBlockProps = {
  items: {
    title: string;
    content: React.ReactNode; // Rich text content from Puck
    imgSrc?: string;
  }[];
  forcedOpen?: boolean;
  container?: ContainerVariant;
};

/**
 * AccordionBlock configuration for Puck Editor
 */
export const AccordionBlock: ComponentConfig<AccordionBlockProps> = {
  fields: {
    items: {
      type: 'array',
      label: 'Accordion Items',
      getItemSummary: (item) => item.title || 'New Item',
      arrayFields: {
        title: {
          type: 'text',
          label: 'Title',
        },
        content: {
          type: 'richtext',
          label: 'Content',
        },
        imgSrc: {
          type: 'text',
          label: 'Image URL (Optional)',
        },
      },
    },
    forcedOpen: {
      type: 'radio',
      label: 'Interactive Mode (Preview)',
      options: [
        { label: 'Interactive (Closed)', value: false },
        { label: 'Edit Mode (All Open)', value: true },
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
  },
  defaultProps: {
    items: [
      {
        title: 'Item 1',
        content: '<p>Content for item 1...</p>',
      },
    ],
    forcedOpen: false,
    container: '980' as ContainerVariant,
  },
  render: ({ items, forcedOpen, container }) => {
    // Transform Puck items into AccordionContained compatible format
    const adaptedItems = items.map((item) => ({
      title: item.title,
      content: (
        <div className="w-full">
          {item.imgSrc ? (
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="flex items-start justify-center md:col-span-6">
                <Img
                  src={item.imgSrc}
                  alt={item.title}
                  className="h-auto w-full rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center md:col-span-6">{item.content}</div>
            </div>
          ) : (
            <div className="mt-2">{item.content}</div>
          )}
        </div>
      ),
    }));

    return (
      <div
        style={{
          maxWidth: CONTAINER_MAP[container || '980'].maxWidth,
        }}
        className="mx-auto"
      >
        <AccordionContained items={adaptedItems} forcedOpen={forcedOpen} />
      </div>
    );
  },
};
