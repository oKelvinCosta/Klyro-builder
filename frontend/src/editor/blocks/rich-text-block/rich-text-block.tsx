/**
 * Puck RichText block: field config, TipTap extensions, canvas render.
 * Toolbar UI lives in rich-text-toolbar.tsx and sibling modules.
 */
import { CONTAINER_MAP, type ContainerVariant } from '@/editor/fields/container-field';
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
    content: 'Texto aqui...',
    container: '980' as ContainerVariant,
  },

  render: ({ content, container }) => (
    <div
      style={{
        maxWidth: CONTAINER_MAP[container || '980'].maxWidth,
      }}
      className="mx-auto"
    >
      {content}
    </div>
  ),
};
