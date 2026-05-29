import { useThemeStore } from '@/editor/stores/use-canvas-theme-store';
import * as React from 'react';

/**
 * GoogleFontLoader Component
 *
 * FUNCTIONALITY:
 * This component automatically synchronizes the document's available fonts with the
 * theme settings. It listens to changes in the `useThemeStore`, extracts the
 * requested font families, and injects `<link>` tags into the DOM to fetch those
 * fonts from the Google Fonts API.
 *
 * HOW TO USE:
 * Simply include this component once inside your Canvas or Preview root component.
 * It doesn't render any visible UI.
 *
 * @example
 * <CanvasWrapper>
 *   <GoogleFontLoader />
 *   <YourContent />
 * </CanvasWrapper>
 */
export function GoogleFontLoader() {
  const { theme } = useThemeStore();

  /**
   * Identifies unique font families defined in the theme that need to be loaded.
   * We use useMemo to avoid re-calculating the list and re-injecting links
   * unless the theme's font settings actually change.
   */
  const fontsToLoad = React.useMemo(() => {
    const fonts = new Set<string>();
    if (theme['title-font-family']) fonts.add(theme['title-font-family']);
    if (theme['text-font-family']) fonts.add(theme['text-font-family']);
    // Filter out empty strings
    return Array.from(fonts).filter((f) => f && f.trim().length > 0);
  }, [theme]);

  return (
    <>
      {fontsToLoad.map((font) => {
        /**
         * Cleaning Heuristic:
         * Google Fonts API expects the raw font name (e.g., "Open Sans").
         * Our theme might store CSS-ready strings like "'Open Sans', sans-serif".
         * 1. The regex match extract text inside quotes or the first part.
         * 2. We split by comma to take only the primary font, ignoring fallbacks.
         * 3. We replace spaces with "+" as required by the Google Fonts URL syntax.
         */
        const match = font.match(/['"]?([^'"]+)['"]?/);
        const fontName = match ? match[1].split(',')[0].trim() : font.split(',')[0].trim();
        const urlName = fontName.replace(/\s+/g, '+');

        return (
          <link
            key={font}
            // We request all weights (100-900) to ensure bold/light variations work as expected.
            href={`https://fonts.googleapis.com/css2?family=${urlName}:wght@100;200;300;400;500;600;700;800;900&display=swap`}
            rel="stylesheet"
          />
        );
      })}
    </>
  );
}
