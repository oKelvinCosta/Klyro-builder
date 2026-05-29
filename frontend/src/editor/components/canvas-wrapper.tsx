import { useThemeStore } from '@/editor/stores/use-canvas-theme-store';
import { GoogleFontLoader } from './google-font-loader';

export function CanvasWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  const cssVars = {
    '--background': theme.background,
    '--foreground': theme.foreground,

    '--card': theme.card,
    '--card-foreground': theme['card-foreground'],

    '--primary': theme.primary,
    '--primary-foreground': theme['primary-foreground'],

    '--secondary': theme.secondary,
    '--secondary-foreground': theme['secondary-foreground'],

    '--tertiary': theme.tertiary,
    '--tertiary-foreground': theme['tertiary-foreground'],

    '--muted': theme.muted,
    '--muted-foreground': theme['muted-foreground'],

    '--accent': theme.accent,
    '--accent-foreground': theme['accent-foreground'],

    '--destructive': theme.destructive,
    '--destructive-foreground': theme['destructive-foreground'],

    '--success': theme.success,
    '--success-foreground': theme['success-foreground'],

    '--border': theme.border,
    '--input': theme.input,
    '--ring': theme.ring,
    '--radius': theme.radius,

    '--extra-color-1': theme['extra-color-1'],
    '--extra-color-2': theme['extra-color-2'],
    '--extra-color-3': theme['extra-color-3'],
    '--extra-color-4': theme['extra-color-4'],
    '--extra-color-5': theme['extra-color-5'],

    '--title-font-family': theme['title-font-family'],
    '--title-font-weight': theme['title-font-weight'],
    '--text-font-family': theme['text-font-family'],
  } as React.CSSProperties;

  return (
    <div className="klyro-canvas" style={cssVars}>
      <GoogleFontLoader />
      {children}
    </div>
  );
}
