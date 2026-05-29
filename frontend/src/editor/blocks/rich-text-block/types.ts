/** Puck block props for the RichText component. */
export type RichTextBlockProps = {
  content: React.ReactNode;
};

/** Which expanded panel is open in the custom toolbar. */
export type ToolbarActiveMenu = 'color' | 'highlight' | 'preset' | null;
