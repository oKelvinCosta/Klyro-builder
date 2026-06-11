/**
 * Builds the full color list for pickers: static swatches + theme HSL tokens.
 */
import { useThemeStore } from '@/editor/stores/use-canvas-theme-store';
import { BASE_COLORS } from './constants';

export function useToolbarColors() {
  const { theme } = useThemeStore();

  return [
    ...BASE_COLORS,
    `hsl(${theme.primary})`,
    `hsl(${theme.destructive})`,
    `hsl(${theme.success})`,
    `hsl(${theme['extra-color-1']})`,
    `hsl(${theme['extra-color-2']})`,
    `hsl(${theme['extra-color-3']})`,
    `hsl(${theme['extra-color-4']})`,
    `hsl(${theme['extra-color-5']})`,
    `hsl(${theme['extra-color-5']})`,
  ];
}
