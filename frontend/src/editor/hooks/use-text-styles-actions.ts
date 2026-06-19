/**
 * Bridge between the text-styles Zustand store and the backend.
 *
 * Data flow when the user saves or deletes a preset:
 * 1. Update Zustand (optimistic UI — toolbar list updates immediately).
 * 2. PATCH `project.textStyles` via `usePageUpdater` (no refetch; `silent: true` skips toast).
 * 3. React Query cache is merged on success (same pattern as theme saves).
 *
 * We do NOT fetch on menu open: presets were already loaded with the project in `usePageLoader`.
 */
import { usePageUpdater } from '@/editor/hooks/use-page-updater';
import type { TextStylePreset } from '@/editor/stores/use-text-styles-store';
import { useTextStylesStore } from '@/editor/stores/use-text-styles-store';
import { useCallback } from 'react';

export function useTextStylesActions() {
  const { updatePage } = usePageUpdater();

  // Subscribe only to what the toolbar needs (avoids re-renders from unrelated store changes).
  const textStyles = useTextStylesStore((s) => s.textStyles);
  const addTextStyle = useTextStylesStore((s) => s.addTextStyle);
  const removeTextStyle = useTextStylesStore((s) => s.removeTextStyle);

  /** Sends the full preset array to the API and keeps the React Query cache in sync. */
  const persist = useCallback(
    (next: TextStylePreset[]) => {
      updatePage.mutate({
        project: { textStyles: next },
        // User-facing saves (theme panel) show a toast; preset CRUD is frequent and silent.
        silent: true,
      });
    },
    [updatePage]
  );

  /** Creates a preset in memory, then persists the updated list. */
  const savePreset = useCallback(
    (preset: Omit<TextStylePreset, 'id'> & { id?: string }) => {
      addTextStyle(preset);
      // `addTextStyle` runs synchronously, so getState() already includes the new item.
      persist(useTextStylesStore.getState().textStyles);
    },
    [addTextStyle, persist]
  );

  /** Removes a preset by id and persists the remaining list. */
  const deletePreset = useCallback(
    (id: string) => {
      const next = removeTextStyle(id);
      persist(next);
    },
    [removeTextStyle, persist]
  );

  return { textStyles, savePreset, deletePreset };
}
