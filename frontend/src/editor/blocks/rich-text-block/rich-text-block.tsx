/**
 * Puck RichText block: field config, TipTap extensions, canvas render.
 * Toolbar UI lives in rich-text-toolbar.tsx and sibling modules.
 */
import type { ComponentConfig } from '@puckeditor/core';
import { RichTextToolbar } from './rich-text-toolbar';
import { richTextTiptapExtensions } from './tiptap-extensions';
import type { RichTextBlockProps } from './types';

export type { RichTextBlockProps } from './types';

export const RichTextBlock: ComponentConfig<RichTextBlockProps> = {
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
  },

  defaultProps: {
    content: 'Texto aqui...',
  },

  render: ({ content }) => <div className="mx-auto">{content}</div>,
};
