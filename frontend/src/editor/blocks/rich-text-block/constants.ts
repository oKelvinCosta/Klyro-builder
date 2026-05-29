/** Fixed swatches in the text/highlight color pickers. */
export const BASE_COLORS = [
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

export type TextSizeOption = {
  value: string;
  label: string;
  fontSize?: string;
};

/** Options for the "Tamanho" select (headings + paragraph sizes). */
export const TEXT_SIZES: TextSizeOption[] = [
  { value: '1', label: 'Heading 1' },
  { value: '2', label: 'Heading 2' },
  { value: '3', label: 'Heading 3' },
  { value: '4', label: 'Heading 4' },
  { value: '5', label: 'Heading 5' },
  { value: '6', label: 'Heading 6' },
  { value: 'p-base', label: 'Parágrafo base' },
  { value: 'p-lg', label: 'Parágrafo lg', fontSize: '1.5rem' },
  { value: 'p-sm', label: 'Parágrafo sm', fontSize: '0.875rem' },
];
