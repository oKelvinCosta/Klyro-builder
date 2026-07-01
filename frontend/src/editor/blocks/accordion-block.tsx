import AccordionContained from '@/components/accordion-contained';
import Img from '@/components/img';
import Container from '@/components/layout/container';
import {
  CONTAINER_MAP,
  ContainerField,
  type ContainerVariant,
} from '@/editor/fields/container-field';
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
  container: ContainerVariant;
};

/**
 * AccordionBlock configuration for Puck Editor
 */
export const AccordionBlock: ComponentConfig<AccordionBlockProps> = {
  label: 'Acordeão',
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
    container: ContainerField(),
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
      <Container
        style={{
          maxWidth: CONTAINER_MAP[container as ContainerVariant].maxWidth,
        }}
      >
        <AccordionContained items={adaptedItems} forcedOpen={forcedOpen} />
      </Container>
    );
  },
};
