/**
 * TipTap extensions registered on this block's richtext field.
 * Defines what can be stored in HTML (fontSize on textStyle, color, highlight).
 * UI commands that apply these marks live in the toolbar components.
 */
import Highlight from '@tiptap/extension-highlight';
import { Color, TextStyle } from '@tiptap/extension-text-style';

export const richTextTiptapExtensions = [
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
];
