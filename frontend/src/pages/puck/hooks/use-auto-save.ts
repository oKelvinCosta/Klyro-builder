import { useCallback, useRef } from 'react';
import { usePageUpdater } from './use-page-updater';

/**
 * Hook to handle auto-save functionality with debounce
 * Manages pending data and timer for optimal performance
 * Also handles page close, tab close, and browser close scenarios
 */
export function useAutoSave() {
  const { updatePage } = usePageUpdater();

  // Refs for managing pending changes and auto-save timer
  const pendingData = useRef<object | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Auto-save handler with .5s debounce
  const handleAutoSave = useCallback(
    (data: object) => {
      // Cancel previous save attempt
      clearTimeout(timerRef.current);

      // Schedule new save
      timerRef.current = setTimeout(() => {
        pendingData.current = data;
        // console.log('Auto-saving:', pendingData.current);
        updatePage.mutate({ puckData: { page: pendingData.current } });
      }, 800);
    },
    [updatePage]
  );

  return {
    handleAutoSave,
    pendingData,
  };
}
