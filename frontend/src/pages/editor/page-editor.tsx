import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { CanvasWrapper } from '@/editor/components/canvas-wrapper';
import { ConfigPanel } from '@/editor/components/config-panel';
import { SnapshotPanel } from '@/editor/components/snapshot-panel';
import { ThemePanel } from '@/editor/components/theme-panel';
import { config } from '@/editor/puck.config';
import { useEditorMode } from '@/editor/stores/editor-mode-store';
import { useThemeStore } from '@/editor/stores/use-canvas-theme-store';
import { useTextStylesStore } from '@/editor/stores/use-text-styles-store';
import '@/styles/canvas.css';
import '@/styles/editor.css';
import { Puck, createUsePuck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { Cog, Eye, Palette, Rocket, Server } from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAutoSave } from '../../editor/hooks/use-auto-save';
import { useJsonExport } from '../../editor/hooks/use-json-export';
import { usePageLoader } from '../../editor/hooks/use-page-loader';

const usePuckData = createUsePuck();

const emptyData = {
  root: { props: {} },
  content: [],
  zones: {},
};

/**
 * Main editor shell for the Puck canvas.
 *
 * Responsibilities:
 * - Load the project and first page from the backend.
 * - Hydrate theme and text style stores for the canvas.
 * - Keep the project title in local state so the header updates only when the
 *   editor explicitly commits the change.
 * - Wire editor actions such as preview, export, auto-save, and sidebar plugins.
 *
 * Data flow for the title:
 * - `pageData.project.title` initializes `projectTitle`.
 * - `ConfigPanel` receives `projectTitle` and `setProjectTitle` as props.
 * - The header uses `projectTitle`, so it changes only after the save flow updates
 *   the parent state.
 */
export function PageEditor() {
  const navigate = useNavigate();
  const { setMode } = useEditorMode();
  const { projectId } = useParams();
  const { data: pageData, isLoading, isError } = usePageLoader(projectId!);
  const { saveJsonFile, isExporting } = useJsonExport();
  const { handleAutoSave } = useAutoSave();
  const [projectTitle, setProjectTitle] = useState('');

  useLayoutEffect(() => {
    if (!pageData) return;

    useThemeStore.getState().hydrateTheme(pageData.project?.theme);
    useTextStylesStore.getState().setTextStyles(pageData.project?.textStyles ?? []);
    setProjectTitle(pageData.project?.title ?? 'Sem título');
  }, [pageData]);

  useEffect(() => {
    setMode('editing');
  }, [setMode]);

  const handlePreview = () => {
    navigate(`/preview/${projectId}`);
  };

  const configParams = {
    projectType: 'choices',
  };

  const firstPage = pageData?.firstPage;
  const initialData = firstPage?.puckData ?? emptyData;

  const themePlugin = {
    name: 'theme',
    label: 'Tema',
    icon: <Palette size={24} />,
    render: () => <ThemePanel />,
  };

  const SnapshotPlugin = {
    name: 'snapshots',
    label: 'Snap...',
    icon: <Server size={24} />,
    render: () => <SnapshotPanel />,
  };

  const ConfigPlugin = {
    name: 'config',
    label: 'Config...',
    icon: <Cog size={24} />,
    render: () => <ConfigPanel projectTitle={projectTitle} setProjectTitle={setProjectTitle} />,
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton style={{ height: '100vh' }} className="flex w-full items-center justify-center">
          <div className="flex items-center gap-2">
            <Spinner className="-mt-1 size-4" /> Loading editor...
          </div>
        </Skeleton>
      </div>
    );
  }

  if (isError || !pageData) {
    return <div>Error loading page.</div>;
  }

  return (
    <div className="klyro-editor">
      <Puck
        key={isLoading ? 'loading' : projectId}
        config={config(configParams)}
        data={initialData}
        onChange={handleAutoSave}
        plugins={[themePlugin, SnapshotPlugin, ConfigPlugin]}
        headerTitle={projectTitle || 'Sem título'}
        renderHeaderActions={() => {
          const currentAppState = usePuckData((state) => state.appState.data);

          const handleExport = async () => {
            await saveJsonFile({
              puckData: currentAppState,
              project: pageData.project,
            });
          };

          return (
            <>
              <Button
                variant="muted"
                title="Preview"
                size="icon"
                onClick={handlePreview}
                disabled={isExporting}
              >
                <Eye />
              </Button>

              <Button
                className="flex items-center"
                onClick={handleExport}
                disabled={isExporting}
                variant="neon"
              >
                {isExporting ? (
                  <>
                    <Spinner className="-mt-1 mr-2 size-4" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2" />
                    Exportar
                  </>
                )}
              </Button>
            </>
          );
        }}
        overrides={{
          iframe: ({ children }) => {
            return <CanvasWrapper>{children}</CanvasWrapper>;
          },
        }}
      />
    </div>
  );
}
