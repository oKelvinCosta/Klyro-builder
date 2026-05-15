import { RichTextMenu, type ComponentConfig } from '@puckeditor/core';
import Highlight from '@tiptap/extension-highlight';
import { Color, TextStyle } from '@tiptap/extension-text-style';

export type RichTextBlockProps = {
  content: React.ReactNode;
};

const COLORS = [
  '#000000',
  '#EF4444', // red
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#fff',
  '#3B82a6', // light blue
  '#10B989', // light green
];

// Text styles configuration
const TEXT_STYLES = [
  { value: 1, label: 'Heading 1' },
  { value: 2, label: 'Heading 2' },
  { value: 3, label: 'Heading 3' },
  { value: 4, label: 'Heading 4' },
  { value: 5, label: 'Heading 5' },
  { value: 6, label: 'Heading 6' },
  { value: 'p-base', label: 'Parágrafo base' },
  { value: 'p-lg', label: 'Parágrafo lg', fontSize: '1.5rem' },
  { value: 'p-sm', label: 'Parágrafo sm', fontSize: '0.875rem' },
];

export const RichTextBlock: ComponentConfig<RichTextBlockProps> = {
  fields: {
    content: {
      type: 'richtext',
      contentEditable: false,

      tiptap: {
        extensions: [
          TextStyle.extend({
            addAttributes() {
              return {
                ...this.parent?.(),
                fontSize: {
                  default: null,
                  parseHTML: (element) => element.style.fontSize,
                  renderHTML: (attributes) => {
                    if (!attributes.fontSize) {
                      return {};
                    }
                    return {
                      style: `font-size: ${attributes.fontSize}`,
                    };
                  },
                },
              };
            },
          }),
          Color,
          Highlight.configure({
            multicolor: true,
            HTMLAttributes: {
              style: 'padding: 4px 4px 2px 4px; border-radius: 3px; background: inherit;',
            },
          }),
        ],
      },

      renderMenu: ({ editor }) => {
        if (!editor) return null;

        return (
          <RichTextMenu>
            <div className="flex flex-wrap">
              {/* DEFAULT CONTROLS */}
              <RichTextMenu.Group>
                <RichTextMenu.Bold />
                <RichTextMenu.Italic />
                <RichTextMenu.BulletList />
                <RichTextMenu.OrderedList />
                <RichTextMenu.AlignSelect />
              </RichTextMenu.Group>

              {/* 🎨 COLOR PICKER */}
              <RichTextMenu.Group>
                <details>
                  <summary style={{ cursor: 'pointer' }}>🎨</summary>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 20px)',
                      gap: 6,
                      padding: 8,
                      background: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: 6,
                      marginTop: 6,
                    }}
                  >
                    {COLORS.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        style={{
                          width: 20,
                          height: 20,
                          background: color,
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                        }}
                        onClick={(event) => {
                          editor.chain().focus().setColor(color).run();
                          // Fechar o dropdown após selecionar cor
                          const colorDetails = event.currentTarget.closest('details');
                          if (colorDetails) {
                            colorDetails.open = false;
                          }
                        }}
                      />
                    ))}

                    {/* remover cor */}
                    <button
                      onClick={(event) => {
                        editor.chain().focus().unsetColor().run();
                        // Fechar o dropdown após remover cor
                        const colorDetails = event.currentTarget.closest('details');
                        if (colorDetails) {
                          colorDetails.open = false;
                        }
                      }}
                      style={{
                        gridColumn: 'span 6',
                        fontSize: 10,
                      }}
                    >
                      Remover cor
                    </button>
                  </div>
                </details>
              </RichTextMenu.Group>

              {/* �️ HIGHLIGHT PICKER */}
              <RichTextMenu.Group>
                <details>
                  <summary style={{ cursor: 'pointer' }}>🖍️</summary>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 20px)',
                      gap: 6,
                      padding: 8,
                      background: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: 6,
                      marginTop: 6,
                    }}
                  >
                    {COLORS.map((color, index) => (
                      <button
                        key={`highlight-${color}-${index}`}
                        style={{
                          width: 20,
                          height: 20,
                          background: color,
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                          borderRadius: 2,
                        }}
                        onClick={(event) => {
                          editor.chain().focus().setHighlight({ color }).run();
                          // Fechar o dropdown após selecionar highlight
                          const highlightDetails = event.currentTarget.closest('details');
                          if (highlightDetails) {
                            highlightDetails.open = false;
                          }
                        }}
                        title={`Highlight ${color}`}
                      />
                    ))}

                    {/* remover highlight */}
                    <button
                      onClick={(event) => {
                        editor.chain().focus().unsetHighlight().run();
                        // Fechar o dropdown após remover highlight
                        const highlightDetails = event.currentTarget.closest('details');
                        if (highlightDetails) {
                          highlightDetails.open = false;
                        }
                      }}
                      style={{
                        gridColumn: 'span 6',
                        fontSize: 10,
                        background: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        padding: 2,
                      }}
                      title="Remover highlight"
                    >
                      Remover highlight
                    </button>
                  </div>
                </details>
              </RichTextMenu.Group>

              {/* �� HEADINGS CUSTOM */}
              <RichTextMenu.Group>
                {(() => {
                  // Check headings first
                  let currentValue: string | number = 'p-base';
                  for (let i = 1; i <= 6; i++) {
                    if (editor.isActive('heading', { level: i })) {
                      currentValue = i;
                      break;
                    }
                  }

                  // Check text styles dynamically
                  if (currentValue === 'p-base') {
                    const activeStyle = TEXT_STYLES.find((style) => {
                      if (style.fontSize) {
                        return editor.isActive('textStyle', { fontSize: style.fontSize });
                      }
                      return (
                        style.value === 'p-base' &&
                        editor.isActive('paragraph') &&
                        !editor.isActive('textStyle')
                      );
                    });

                    currentValue = activeStyle?.value || 'p-base';
                  }

                  return (
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        const style = TEXT_STYLES.find((s) => s.value === value);

                        if (value === 'p-base') {
                          editor.chain().focus().setParagraph().unsetMark('textStyle').run();
                        } else if (style?.fontSize) {
                          editor
                            .chain()
                            .focus()
                            .setParagraph()
                            .setMark('textStyle', { fontSize: style.fontSize })
                            .run();
                        } else {
                          const level = Number(value) as 1 | 2 | 3 | 4 | 5 | 6;
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level })
                            .unsetMark('textStyle')
                            .run();
                        }
                      }}
                      value={String(currentValue)}
                    >
                      {TEXT_STYLES.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </RichTextMenu.Group>

              {/*  LINKS */}
              <RichTextMenu.Group>
                Link
                <button
                  onClick={() => {
                    const url = prompt('Digite a URL');

                    if (!url) return;

                    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                  }}
                  title="Adicionar link"
                >
                  🔗
                </button>
                <button
                  onClick={() => {
                    editor?.chain().focus().unsetLink().run();
                  }}
                  title="Remover link"
                >
                  ❌
                </button>
              </RichTextMenu.Group>
            </div>
          </RichTextMenu>
        );
      },
    },
  },

  defaultProps: {
    content: 'Texto aqui...',
  },

  render: ({ content }) => <div className="mx-auto">{content}</div>,
};
