/**
 * Custom Puck richtext toolbar: formatting, colors, text size, presets, link.
 * Wired via RichTextBlock field `renderMenu`.
 */
import { ColorPickerField } from '@/editor/components/color-picker-field';
import { useTextStylesActions } from '@/editor/hooks/use-text-styles-actions';
import { RichTextMenu } from '@puckeditor/core';
import { useEffect, useState } from 'react';
import { PresetsPanel } from './presets-panel';
import { TextSizeSelect } from './text-size-select';
import type { ToolbarActiveMenu } from './types';
import { useToolbarColors } from './use-toolbar-colors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RichTextToolbarProps = { editor: any };

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const allColors = useToolbarColors();
  const { textStyles: presets, savePreset, deletePreset } = useTextStylesActions();
  const [activeMenu, setActiveMenu] = useState<ToolbarActiveMenu>(null);

  const getMarkColor = (markName: string) => {
    if (!editor) return undefined;
    const attrs = editor.getAttributes(markName);
    if (attrs?.color) return attrs.color;
    // Fallback to storedMarks for empty selections where getAttributes returns undefined
    const storedMarks = editor.state?.storedMarks;
    const mark = storedMarks?.find((m: any) => m.type.name === markName);
    return mark?.attrs?.color;
  };

  const currentTextColor = getMarkColor('textStyle') ?? allColors[0];
  const currentHighlight = getMarkColor('highlight') ?? allColors[0];

  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;
    const updateToolbar = () => forceUpdate({});
    editor.on('transaction', updateToolbar);
    return () => {
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

  const closeMenu = () => setActiveMenu(null);

  return (
    <RichTextMenu>
      <div className="flex w-full flex-col gap-2 p-1">
        <div className="flex flex-wrap items-center gap-1">
          <RichTextMenu.Group>
            <RichTextMenu.Bold />
            <RichTextMenu.Italic />
            <RichTextMenu.BulletList />
            <RichTextMenu.OrderedList />
            <RichTextMenu.AlignSelect />
          </RichTextMenu.Group>

          <RichTextMenu.Group>
            {/* Text Color */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'color' ? null : 'color')}
              className={`flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100 ${activeMenu === 'color' ? 'bg-slate-200' : ''}`}
              title="Cor do texto"
            >
              🎨
            </button>

            {/* Highlight Color */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'highlight' ? null : 'highlight')}
              className={`flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100 ${activeMenu === 'highlight' ? 'bg-slate-200' : ''}`}
              title="Cor de fundo"
            >
              🖍️
            </button>
          </RichTextMenu.Group>

          {/* Text Size */}
          <RichTextMenu.Group>
            <TextSizeSelect editor={editor} />
          </RichTextMenu.Group>

          {/* Text Presets */}
          <RichTextMenu.Group>
            <button
              onClick={() => setActiveMenu(activeMenu === 'preset' ? null : 'preset')}
              className={`flex h-7 items-center gap-1 rounded px-2 text-xs font-medium hover:bg-slate-100 ${activeMenu === 'preset' ? 'bg-slate-200' : 'bg-slate-50'}`}
            >
              Estilos {presets.length > 0 && `(${presets.length})`} ▾
            </button>
          </RichTextMenu.Group>

          {/* Hiperlink */}
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

        {activeMenu && (
          <div className="bg-muted rounded-md border p-2">
            {/* Menu Text Color */}
            {activeMenu === 'color' && (
              <div className="flex items-start gap-2 p-1">
                <ColorPickerField
                  value={currentTextColor}
                  onChange={(color) => {
                    editor.chain().focus().setColor(color).run();
                  }}
                  enableGradient={false}
                  allowColorTypeToggle={false}
                  showPresets={true}
                  presets={allColors}
                  width={280}
                  height={100}
                  className="min-w-[50%]"
                />
                <button
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    closeMenu();
                  }}
                  className="mt-2 text-xs font-medium text-slate-500 transition-colors hover:text-red-500"
                  title="Remover cor"
                >
                  Remover
                </button>
              </div>
            )}

            {/* Menu Highlight Color */}
            {activeMenu === 'highlight' && (
              <div className="flex items-start gap-2 p-1">
                <ColorPickerField
                  value={currentHighlight}
                  onChange={(color) => {
                    editor.chain().focus().setHighlight({ color }).run();
                  }}
                  enableGradient={false}
                  allowColorTypeToggle={false}
                  showPresets={true}
                  presets={allColors}
                  width={280}
                  height={100}
                  className="min-w-[50%]"
                />
                <button
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    closeMenu();
                  }}
                  className="mt-2 text-xs font-medium text-slate-500 transition-colors hover:text-red-500"
                  title="Remover fundo"
                >
                  Remover
                </button>
              </div>
            )}

            {/* Menu Presets */}
            {activeMenu === 'preset' && (
              <PresetsPanel
                editor={editor}
                presets={presets}
                onSavePreset={(preset) => {
                  savePreset(preset);
                  setActiveMenu(null);
                }}
                onSetActiveMenu={(menu) => setActiveMenu(menu)}
                onDeletePreset={deletePreset}
              />
            )}
          </div>
        )}
      </div>
    </RichTextMenu>
  );
}
