/**
 * Puck RichText block: field config, TipTap extensions, canvas render.
 * Toolbar UI lives in rich-text-toolbar.tsx and sibling modules.
 */
import Container from '@/components/layout/container';
import {
  CONTAINER_MAP,
  ContainerField,
  type ContainerVariant,
} from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';
import { RichTextToolbar } from './rich-text-toolbar';
import { richTextTiptapExtensions } from './tiptap-extensions';
import type { RichTextBlockProps } from './types';

export type { RichTextBlockProps } from './types';

export const RichTextBlock: ComponentConfig<RichTextBlockProps> = {
  label: 'Texto',
  fields: {
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
    container: ContainerField(),
  },

  defaultProps: {
    content: 'Texto aqui...',
    container: '980' as ContainerVariant,
  },

  render: ({ content, container }) => (
    <Container
      style={{
        maxWidth: CONTAINER_MAP[container as ContainerVariant].maxWidth,
      }}
    >
      {content}
    </Container>
  ),
};
