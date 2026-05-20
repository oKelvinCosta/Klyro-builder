// src/stores/useCanvasThemeStore.ts
import { create } from 'zustand';

export interface CanvasTheme {
  background: string;
  foreground: string;

  card: string;
  'card-foreground': string;

  primary: string;
  'primary-foreground': string;

  secondary: string;
  'secondary-foreground': string;

  tertiary: string;
  'tertiary-foreground': string;

  destructive: string;
  'destructive-foreground': string;

  success: string;
  'success-foreground': string;

  border: string;
  input: string;
  ring: string;
  radius: string;

  'extra-color-1': string;
  'extra-color-2': string;
  'extra-color-3': string;
  'extra-color-4': string;
  'extra-color-5': string;

  'title-font-family': string;
  'title-font-weight': string;
  'text-font-family': string;
}

// Tema padrão mockado — futuramente vem do banco
// Always maintan synchronized with canvas.css
const defaultTheme: CanvasTheme = {
  background: '253 0% 100%',
  foreground: '253 25% 25%',
  card: '0 0% 100%',
  'card-foreground': '253 24% 31%',
  primary: '67.85 99.34% 47.25%',
  'primary-foreground': '253 25% 25%',

  secondary: '207 100% 50%',
  'secondary-foreground': '0 0% 100%',

  tertiary: '255 100% 57%',
  'tertiary-foreground': '0 0% 100%',

  destructive: '0 84.2% 60.2%',
  'destructive-foreground': '0 0% 100%',

  success: '160.1 84.1% 39.4%',
  'success-foreground': '0 0% 100%',

  border: '253 25% 86%',
  input: '20 5.9% 90%',
  ring: '215 20.2% 65.1%',
  radius: '0.5rem',

  'extra-color-1': '0 84.2% 60.2%',
  'extra-color-2': '45.4 93.4% 47.5%',
  'extra-color-3': '142.1 70.6% 45.3%',
  'extra-color-4': '198.6 88.7% 48.4%',
  'extra-color-5': '292.2 84.1% 60.6%',

  'title-font-family': "'Space Grotesk', 'Roboto', 'Helvetica Neue', sans-serif",
  'title-font-weight': '700',
  'text-font-family': "'Lexend', 'Roboto', 'Helvetica Neue', sans-serif",
};

interface CanvasThemeStore {
  theme: CanvasTheme;
  setTheme: (theme: Partial<CanvasTheme>) => void;
  resetTheme: () => void;
}

export const useCanvasThemeStore = create<CanvasThemeStore>((set) => ({
  theme: defaultTheme,
  setTheme: (partial) => set((state) => ({ theme: { ...state.theme, ...partial } })),
  resetTheme: () => set({ theme: defaultTheme }),
}));
