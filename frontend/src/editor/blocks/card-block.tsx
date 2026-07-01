import Container from '@/components/layout/container';
import MainCard from '@/components/main-card';
import {
  CONTAINER_MAP,
  ContainerField,
  type ContainerVariant,
} from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';
import { RichTextToolbar } from './rich-text-block/rich-text-toolbar';
import { richTextTiptapExtensions } from './rich-text-block/tiptap-extensions';

export type CardBlockProps = {
  imgSrc?: string;
  title?: string;
  display?: boolean;
  side?: 'left' | 'right';
  content?: React.ReactNode;
  // variant?: 'default' | 'gray';
  container: ContainerVariant;
  slot?: React.ReactNode;
};

export const CardBlock: ComponentConfig<CardBlockProps> = {
  label: 'Cartão',
  fields: {
    imgSrc: { type: 'text' },
    title: { type: 'text' },

    content: {
      type: 'richtext',
      contentEditable: false,
      tiptap: {
        extensions: richTextTiptapExtensions,
      },
      renderMenu: ({ editor }) => {
        if (!editor) return null;
        return <RichTextToolbar editor={editor} />;
      },
    },
    display: {
      label: 'Disposição',
      type: 'radio',
      options: [
        { label: 'Vertical', value: false },
        { label: 'Horizontal', value: true },
      ],
    },
    // variant: {
    //   type: 'radio',
    //   options: [
    //     // Temporarily disabled: default card style
    //     { label: 'Default', value: 'default' },
    //     // Temporarily disabled: gray card style
    //     { label: 'Gray', value: 'gray' },
    //   ],
    // },
    container: ContainerField(),
    slot: {
      type: 'slot',
    },
  },
  resolveFields: (data, { fields }) => {
    const { side, display, container, ...rest } = fields;

    if (data.props.display) {
      return {
        ...rest,

        display,
        side: {
          type: 'radio',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
        container,
      };
    }

    return {
      ...rest,

      display,
      container,
    };
  },
  defaultProps: {
    title: 'Título do card',
    content: 'Conteúdo do card aqui...',
    display: false,
    side: 'left',
    // variant: 'default',
    container: '980' as ContainerVariant,
    imgSrc: '',
    slot: [],
  },
  render: ({ imgSrc, title, display, side, content, container, slot: _slot }) => {
    return (
      <Container
        style={{
          maxWidth: CONTAINER_MAP[container as ContainerVariant].maxWidth,
        }}
      >
        <MainCard
          imgSrc={imgSrc || undefined}
          title={title}
          horizontal={display}
          side={side}
          editorMode
          // variant={variant}
        >
          {content}
          {/* {Slot ? <SlotPuck Slot={Slot as React.ElementType} style={{ gap: '2rem' }} /> : ''} */}
        </MainCard>
      </Container>
    );
  },
};
