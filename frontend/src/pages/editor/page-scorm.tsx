import { Spinner } from '@/components/ui/spinner';
import { CanvasWrapper } from '@/editor/components/canvas-wrapper';
import { config } from '@/editor/puck.config';
import { useThemeStore, type CanvasTheme } from '@/editor/stores/use-canvas-theme-store';
import { useTextStylesStore } from '@/editor/stores/use-text-styles-store';
import '@/styles/canvas.css';
import { Render, type Data } from '@puckeditor/core';
import { useEffect, useState } from 'react';

type ExportedScormData = {
  puckData?: Data;
  project?: {
    theme?: Partial<CanvasTheme> | null;
    textStyles?: unknown[] | null;
  };
};

/**
 * Page component that renders static Puck data from a SCORM-generated JSON file.
 * Uses native fetch since the file path is only known at runtime (per-user temp folder).
 */
export function PageScorm() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // React Compiler automatically memoizes this evaluation
  const puckConfig = config({ projectType: 'choices' });

  useEffect(() => {
    fetch('./puck-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ExportedScormData | Data) => {
        const hasExportWrapper = typeof json === 'object' && json !== null && 'puckData' in json;
        const exportedData = hasExportWrapper ? (json as ExportedScormData) : null;
        const puckData = (exportedData?.puckData ?? json) as Data;

        // CanvasWrapper reads the store, and aplly css
        useThemeStore.getState().hydrateTheme(exportedData?.project?.theme);
        useTextStylesStore.getState().setTextStyles(exportedData?.project?.textStyles ?? []);

        setData(puckData);
      })
      .catch((err) => {
        console.error('Erro ao carregar puck-data.json:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner className="size-8" />
        <span className="ml-2 font-medium text-gray-600">Carregando conteúdo...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white text-red-500">
        <h2 className="text-xl font-bold">Erro ao carregar o conteúdo</h2>
        <p className="mt-2 text-gray-600">
          O arquivo puck-data.json não foi encontrado ou está corrompido.
        </p>
      </div>
    );
  }

  return (
    <CanvasWrapper>
      <Render config={puckConfig} data={data} />
    </CanvasWrapper>
  );
}
