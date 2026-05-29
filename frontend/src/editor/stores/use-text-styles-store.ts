/**
 * In-memory store for user-defined rich-text style presets (project scope).
 *
 * Why Zustand here (and not only React Query)?
 * - The toolbar reads/writes presets very often; a small global store avoids prop drilling
 *   through Puck and keeps the list instant (no network on every menu open).
 * - The source of truth on the server is still `project.textStyles`; this store is a
 *   session cache hydrated once when the editor loads (see page-editor.tsx).
 *
 * Persistence is handled separately in `use-text-styles-actions.ts` (PATCH + React Query cache).
 */
import { create } from 'zustand';

/** TipTap marks captured from the current selection when the user saves a preset. */
export type TextStyleSnapshot = {
  color: string | null;
  fontSize: string | null;
  highlight: string | null;
  bold: boolean;
  italic: boolean;
  /** Heading level 1–6, or null when the block is a plain paragraph. */
  heading: number | null;
};

/** One named preset stored on the project document in MongoDB. */
export type TextStylePreset = {
  id: string;
  name: string;
  styles: TextStyleSnapshot;
};

/**
 * Converts API / legacy data into a safe in-app shape.
 * - Guards against non-arrays (old projects, partial payloads).
 * - Assigns stable `id`s so list keys and delete actions work even for older records
 *   that were saved before ids existed.
 */
function normalizePresets(raw: unknown): TextStylePreset[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const preset = item as Partial<TextStylePreset>;
    return {
      id: typeof preset.id === 'string' ? preset.id : `legacy-${index}`,
      name: typeof preset.name === 'string' ? preset.name : 'Sem nome',
      styles: (preset.styles ?? {}) as TextStyleSnapshot,
    };
  });
}

interface TextStylesStore {
  /** All presets for the current project (editor session). */
  textStyles: TextStylePreset[];
  /** Replace the full list — used when hydrating from GET /projects/:id. */
  setTextStyles: (presets: TextStylePreset[] | unknown) => void;
  /** Append one preset locally; returns the entry (with generated id if missing). */
  addTextStyle: (preset: Omit<TextStylePreset, 'id'> & { id?: string }) => TextStylePreset;
  /** Remove by id; returns the new array (handy for immediate PATCH payloads). */
  removeTextStyle: (id: string) => TextStylePreset[];
  /** Clear store (e.g. when leaving the editor or switching projects). */
  resetTextStyles: () => void;
}

export const useTextStylesStore = create<TextStylesStore>((set, get) => ({
  textStyles: [],

  setTextStyles: (presets) => set({ textStyles: normalizePresets(presets) }),

  addTextStyle: (preset) => {
    const entry: TextStylePreset = {
      id: preset.id ?? crypto.randomUUID(),
      name: preset.name,
      styles: preset.styles,
    };
    set({ textStyles: [...get().textStyles, entry] });
    return entry;
  },

  removeTextStyle: (id) => {
    const next = get().textStyles.filter((p) => p.id !== id);
    set({ textStyles: next });
    return next;
  },

  resetTextStyles: () => set({ textStyles: [] }),
}));
