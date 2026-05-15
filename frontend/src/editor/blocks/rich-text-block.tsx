import { Button } from '@/components/ui/button';
import { useCanvasThemeStore } from '@/editor/stores/use-canvas-theme-store';
import { RichTextMenu, type ComponentConfig } from '@puckeditor/core';
import Highlight from '@tiptap/extension-highlight';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export type RichTextBlockProps = {
  content: React.ReactNode;
};

const BASE_COLORS = [
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
const RichTextToolbar = ({ editor }: { editor: any }) => {
  const { theme } = useCanvasThemeStore();
  const [presets, setPresets] = useState<{ name: string; styles: any }[]>([]);
  const [activeMenu, setActiveMenu] = useState<'color' | 'highlight' | 'preset' | null>(null);

  // Combine static base colors with dynamic theme colors
  const allColors = [
    ...BASE_COLORS,
    `hsl(${theme.primary})`,
    `hsl(${theme.secondary})`,
    `hsl(${theme.tertiary})`,
    `hsl(${theme.accent})`,
    `hsl(${theme.destructive})`,
    `hsl(${theme.success})`,
    `hsl(${theme['extra-color-1']})`,
    `hsl(${theme['extra-color-2']})`,
    `hsl(${theme['extra-color-3']})`,
    `hsl(${theme['extra-color-4']})`,
    `hsl(${theme['extra-color-5']})`,
  ];

  const handleSavePreset = () => {
    const name = prompt('Nome do estilo (ex: Destaque Rosa):');
    if (!name) return;

    const attrs = editor.getAttributes('textStyle');
    const highlight = editor.getAttributes('highlight');

    // Capturar se é um Heading (Título)
    let heading = null;
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        heading = i;
        break;
      }
    }

    const newPreset = {
      name,
      styles: {
        color: attrs.color || null,
        fontSize: attrs.fontSize || null,
        highlight: highlight.color || null,
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        heading,
      },
    };

    setPresets((prev) => [...prev, newPreset]);
    setActiveMenu('preset');
  };

  const handleApplyPreset = (styles: any) => {
    let chain = editor.chain().focus();

    // Reset marks base e estilos de texto
    chain = chain.unsetBold().unsetItalic().unsetColor().unsetHighlight().unsetMark('textStyle');

    // Aplicar tipo de bloco (Heading ou Parágrafo)
    if (styles.heading) {
      chain = chain.setHeading({ level: styles.heading });
    } else {
      chain = chain.setParagraph();
    }

    if (styles.bold) chain = chain.setBold();
    if (styles.italic) chain = chain.setItalic();
    if (styles.color) chain = chain.setColor(styles.color);
    if (styles.highlight) chain = chain.setHighlight({ color: styles.highlight });
    if (styles.fontSize) chain = chain.setMark('textStyle', { fontSize: styles.fontSize });

    chain.run();
  };

  const renderColorPalette = (
    title: string,
    onSelect: (color: string) => void,
    onRemove: () => void,
    removeLabel: string
  ) => (
    <div className="flex flex-col gap-2 px-4 py-2">
      <span className="text-[10px] font-bold uppercase text-slate-400">{title}</span>
      <div className="grid grid-cols-9 gap-4">
        {allColors.map((color) => (
          <button
            key={color}
            className="h-5 w-5 rounded-sm border border-white shadow-sm transition-transform hover:scale-110"
            style={{ background: color }}
            onClick={() => {
              onSelect(color);
              setActiveMenu(null);
            }}
          />
        ))}
      </div>
      <Button
        variant="link"
        size="sm"
        className="h-6 w-fit p-0 text-[10px]"
        onClick={() => {
          onRemove();
          setActiveMenu(null);
        }}
      >
        {removeLabel}
      </Button>
    </div>
  );

  return (
    <RichTextMenu>
      <div className="flex w-full flex-col gap-2 p-1">
        {/* TOP ROW: ICON CONTROLS */}
        <div className="flex flex-wrap items-center gap-1">
          <RichTextMenu.Group>
            <RichTextMenu.Bold />
            <RichTextMenu.Italic />
            <RichTextMenu.BulletList />
            <RichTextMenu.OrderedList />
            <RichTextMenu.AlignSelect />
          </RichTextMenu.Group>

          <RichTextMenu.Group>
            <button
              onClick={() => setActiveMenu(activeMenu === 'color' ? null : 'color')}
              className={`flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100 ${activeMenu === 'color' ? 'bg-slate-200' : ''}`}
              title="Cor do texto"
            >
              🎨
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'highlight' ? null : 'highlight')}
              className={`flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100 ${activeMenu === 'highlight' ? 'bg-slate-200' : ''}`}
              title="Cor de fundo"
            >
              🖍️
            </button>
          </RichTextMenu.Group>

          <RichTextMenu.Group>
            {(() => {
              let currentValue: string | number = 'p-base';
              for (let i = 1; i <= 6; i++) {
                if (editor.isActive('heading', { level: i })) {
                  currentValue = i;
                  break;
                }
              }
              return (
                <select
                  className="h-7 rounded border border-slate-200 bg-transparent px-1 text-xs outline-none"
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
                      editor.chain().focus().toggleHeading({ level }).unsetMark('textStyle').run();
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

          <RichTextMenu.Group>
            <button
              onClick={() => setActiveMenu(activeMenu === 'preset' ? null : 'preset')}
              className={`flex h-7 items-center gap-1 rounded px-2 text-xs font-medium hover:bg-slate-100 ${activeMenu === 'preset' ? 'bg-slate-200' : 'bg-slate-50'}`}
            >
              Estilos {presets.length > 0 && `(${presets.length})`} ▾
            </button>
          </RichTextMenu.Group>

          <RichTextMenu.Group>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const url = prompt('Digite a URL');
                  if (url)
                    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100"
                title="Link"
              >
                🔗
              </button>
            </div>
          </RichTextMenu.Group>
        </div>

        {/* BOTTOM ROW: EXPANDED MENUS */}
        {activeMenu && (
          <div className="bg-muted rounded-md border border-slate-100 p-2">
            {activeMenu === 'color' &&
              renderColorPalette(
                'Cor do Texto',
                (color) => editor.chain().focus().setColor(color).run(),
                () => editor.chain().focus().unsetColor().run(),
                'Remover cor'
              )}

            {activeMenu === 'highlight' &&
              renderColorPalette(
                'Cor de Fundo',
                (color) => editor.chain().focus().setHighlight({ color }).run(),
                () => editor.chain().focus().unsetHighlight().run(),
                'Remover fundo'
              )}

            {activeMenu === 'preset' && (
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-mute text-[10px] font-bold uppercase">Estilos Salvos</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={handleSavePreset}
                  >
                    + Novo
                  </Button>
                </div>
                {presets.length === 0 ? (
                  <p className="py-2 text-center text-[10px] italic text-slate-400">
                    Nenhum estilo salvo
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {presets.map((preset, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-white p-1.5 shadow-sm"
                      >
                        <button
                          onClick={() => handleApplyPreset(preset.styles)}
                          className="flex-1 text-left text-xs font-medium text-slate-700"
                        >
                          {preset.name}
                        </button>
                        <button
                          onClick={() => setPresets(presets.filter((_, i) => i !== index))}
                          className="p-1 text-slate-300 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </RichTextMenu>
  );
};

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
        return <RichTextToolbar editor={editor} />;
      },
    },
  },

  defaultProps: {
    content: 'Texto aqui...',
  },

  render: ({ content }) => <div className="mx-auto">{content}</div>,
};
