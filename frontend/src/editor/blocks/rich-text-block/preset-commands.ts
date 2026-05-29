/**
 * Editor commands for saved text style presets (project.textStyles).
 * Persistence is handled by use-text-styles-actions; this file only talks to TipTap.
 */
import type { TextStyleSnapshot } from '@/editor/stores/use-text-styles-store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorLike = any;

/** Reads the current selection's marks into a preset payload. */
export function capturePresetSnapshot(editor: EditorLike): TextStyleSnapshot {
  const attrs = editor.getAttributes('textStyle');
  const highlight = editor.getAttributes('highlight');

  let heading = null;
  for (let i = 1; i <= 6; i++) {
    if (editor.isActive('heading', { level: i })) {
      heading = i;
      break;
    }
  }

  return {
    color: attrs.color || null,
    fontSize: attrs.fontSize || null,
    highlight: highlight.color || null,
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    heading,
  };
}

/** Applies a saved preset to the current editor selection. */
export function applyPresetToEditor(editor: EditorLike, styles: TextStyleSnapshot) {
  let chain = editor.chain().focus();

  chain = chain.unsetBold().unsetItalic().unsetColor().unsetHighlight().unsetMark('textStyle');

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
}
