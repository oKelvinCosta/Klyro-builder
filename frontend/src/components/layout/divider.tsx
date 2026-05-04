import { DIVIDERS, type DividerProps } from './divider-sections';

/**
 * Divider
 * Renders one of the SVG DIVIDERS by key.
 */
export default function Divider({ type, flipY, fitTo, className }: DividerProps) {
  // Compute a small translation to snug the divider to the top or bottom edge.
  const fit = fitTo && (fitTo === 'top' ? 'translate-y-[-3px]' : 'translate-y-[3px]');
  return (
    <div className={`${flipY ? '-scale-y-100' : ''} ${fit} ${className}`}>
      {DIVIDERS[type].svg()}
    </div>
  );
}
