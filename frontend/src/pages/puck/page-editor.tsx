// Imports
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { config } from '@/editor/puck.config';
import { useEditorMode } from '@/editor/stores/editor-mode-store';
import { Puck, createUsePuck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { Cog, Eye, Rocket, Server } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import database from '../../../../backend/database/database.json';
// import database2 from '../../../../backend/database/database2.json';
import { CanvasWrapper } from '@/editor/components/canvas-wrapper';
import { ConfigPanel } from '@/editor/components/config-panel';
import { SnapshotPanel } from '@/editor/components/snapshot-panel';
import { CanvasThemePanel } from '@/editor/components/theme-panel';
import '@/styles/canvas.css';
import '@/styles/editor.css';
import { Palette } from 'lucide-react';
import { useAutoSave } from './hooks/use-auto-save';
import { useJsonExport } from './hooks/use-json-export';
import { usePageLoader } from './hooks/use-page-loader';

// Static data for testing (can be removed if unused)
// const initialData = database;
// const database2Data = database2;

// Custom Puck hook with optimized selector for better performance
const usePuckData = createUsePuck();

const emptyData = {
  root: { props: {} },
  content: [],
  zones: {},
};

/**
 * Main Puck Editor Component
 * Handles page loading, editing, and auto-save functionality
 */
export function PageEditor() {
  // Navigation and editor mode hooks
  const navigate = useNavigate();
  const { setMode } = useEditorMode();
  const { projectId } = useParams();

  console.log('useParams()', useParams());

  // Page loader hook - projectId is required, so we use non-null assertion
  const { data: pageData, isLoading, isError } = usePageLoader(projectId!);

  // JSON export hook
  const { saveJsonFile, isExporting } = useJsonExport();

  // Auto-save hook with debounce functionality
  const { handleAutoSave } = useAutoSave();

  // console.log('Page data fetched:', pageData?.puckData);

  // Set editor mode to editing on component mount
  // To render something different in editor mode
  useEffect(() => {
    setMode('editing');
  }, [setMode]);

  // Handle preview
  const handlePreview = () => {
    navigate(`/preview/${projectId}`);
  };

  // Configuration for Puck editor
  const configParams = {
    projectType: 'choices',
  };

  // Initial data for Puck editor
  const firstPage = pageData?.firstPage;
  const initialData = firstPage?.puckData ?? emptyData;

  // Define the theme plugin to add a new tab to the sidebar
  const themePlugin = {
    name: 'theme',
    label: 'Tema',
    icon: <Palette size={24} />,
    render: () => <CanvasThemePanel />,
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
    render: () => <ConfigPanel />,
  };

  // Loading state - show skeleton while fetching data
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

  // Error state - show error message if fetch fails
  if (isError || !pageData) {
    return <div>Error loading page.</div>;
  }

  // emptyData was moved above useMemo

  // The initialData logic above replaces the Ref-based initialization
  // to comply with React's rules about not accessing refs during render.

  return (
    <div className="klyro-editor">
      <Puck
        key={isLoading ? 'loading' : projectId}
        config={config(configParams)}
        data={initialData}
        onChange={handleAutoSave}
        plugins={[themePlugin, SnapshotPlugin, ConfigPlugin]}
        overrides={{
          // Header actions with preview and export functionality
          headerActions: function HeaderActions() {
            // Get current Puck data for export
            const currentAppState = usePuckData((state) => state.appState.data);

            const handlePublish = async () => {
              await saveJsonFile(currentAppState);
            };

            return (
              <>
                <Button
                  variant="muted"
                  title="Preview"
                  size={'icon'}
                  onClick={handlePreview}
                  disabled={isExporting}
                >
                  <Eye />
                </Button>

                <Button
                  className="flex items-center"
                  onClick={handlePublish}
                  disabled={isExporting}
                  variant={'neon'}
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
          },

          // Custom iframe wrapper with puck-canvas class
          iframe: ({ children }) => {
            return <CanvasWrapper>{children}</CanvasWrapper>;
          },
        }}
      />
    </div>
  );
}

/*
Note: config and blocks must be functions so zustand store 
can be used correctly inside them
*/

// Preparing to use pagination
//
// 1. Modelo de "Múltiplas Páginas" (Recomendado para SCORM)
// Nesse modelo, cada página é um objeto de dados (JSON) independente. O "Projeto" seria uma coleção dessas páginas.

// Como funcionaria no Editor:
// Você teria um painel lateral (como o de "Tema" que você já tem) chamado "Páginas".
// Lá, o usuário veria uma lista: Página 1, Página 2, etc.
// Ao clicar em uma página, o editor carregaria o pageId correspondente na URL (ex: /editor/projeto-1/pagina-2).
// O componente PageEditor que você já tem apenas trocaria os dados do canvas.
// Como funcionaria no Visualizador (Player):
// O player carrega a primeira página. Ao chegar no final, um botão "Próxima Página" simplesmente carrega o próximo JSON da lista.
// Vantagens:
// Performance: O navegador não precisa renderizar 50 blocos de uma vez; ele renderiza apenas o que está na página atual.
// SCORM: É muito mais fácil rastrear o progresso ("O aluno completou 3 de 5 páginas").
// Organização: Você pode reordenar páginas facilmente arrastando-as na lista lateral.
