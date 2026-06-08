import CarouselCard from '@/components/carousel-card';
import { Button } from '@/components/ui/button';
import { CONTAINER_MAP, type ContainerVariant } from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';
import type * as React from 'react';

/**
 * Props for the CarouselBlock component
 */
export type CarouselBlockProps = {
  items: {
    title: string;
    content: React.ReactNode;
    imgSrc?: string;
    buttonText?: string;
    buttonLink?: string;
    buttonVariant?: 'indigo' | 'gray' | 'lime' | 'red' | 'outline' | 'link';
  }[];
  layout: '1:1' | '1:2' | '2:1';
  container?: ContainerVariant;
};

const placeholderImgUrl =
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop';

/**
 * CarouselBlock configuration for Puck Editor
 */
export const CarouselBlock: ComponentConfig<CarouselBlockProps> = {
  fields: {
    items: {
      type: 'array',
      label: 'Carousel Items',
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
          label: 'Image URL',
        },
        buttonText: {
          type: 'text',
          label: 'Button Text',
        },
        buttonLink: {
          type: 'text',
          label: 'Button Link',
        },
        buttonVariant: {
          type: 'select',
          label: 'Button Variant',
          options: [
            { label: 'Indigo', value: 'indigo' },
            { label: 'Gray', value: 'gray' },
            { label: 'Lime', value: 'lime' },
            { label: 'Red', value: 'red' },
            { label: 'Outline', value: 'outline' },
            { label: 'Link', value: 'link' },
          ],
        },
      },
    },
    layout: {
      type: 'select',
      label: 'Carousel Layout',
      options: [
        { label: '1:1 (Square)', value: '1:1' },
        { label: '1:2 (Smaller Image)', value: '1:2' },
        { label: '2:1 (Larger Image)', value: '2:1' },
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
        title: 'Slide 1 Title',
        content: '<p>Slide 1 content...</p>',
        imgSrc: placeholderImgUrl,
        buttonText: 'Learn More',
        buttonLink: '#',
        buttonVariant: 'indigo',
      },
    ],
    layout: '1:2',
    container: '980' as ContainerVariant,
  },
  render: ({ items, layout, container }) => {
    // Transform Puck items into CarouselCard compatible format
    const adaptedItems = items.map((item) => ({
      imgSrc: item.imgSrc || placeholderImgUrl,
      title: item.title,
      content: (
        <div className="flex flex-col gap-4">
          {/* Render the rich text content directly */}
          {item.content}

          {/* Render optional action button */}
          {item.buttonText && item.buttonLink && (
            <div className="mt-2">
              <a href={item.buttonLink} target="_blank" rel="noopener noreferrer">
                <Button variant={item.buttonVariant || 'indigo'}>{item.buttonText}</Button>
              </a>
            </div>
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
        <CarouselCard items={adaptedItems} layout={layout} />
      </div>
    );
  },
};
