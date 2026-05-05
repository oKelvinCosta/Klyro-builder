// Imports
import '@//styles/editor.css';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { config } from '@/editor/puck.config';
import { useEditorMode } from '@/editor/stores/editor-mode-store';
import { Puck, createUsePuck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { Eye, Rocket } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import database from '../../../../backend/database/database.json';
// import database2 from '../../../../backend/database/database2.json';
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
  const { pageId } = useParams();

  // Page loader hook
  const { data: pageData, isLoading, isError } = usePageLoader(pageId);

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
    navigate(`/preview/${pageId}`);
  };

  // Configuration for Puck editor
  const configParams = {
    projectType: 'choices',
  };

  // Initial data memoized to stay stable once loaded
  const initialData = React.useMemo(() => {
    if (!pageData) return emptyData;
    return pageData?.puckData?.page ?? emptyData;
  }, [pageData]);

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
    <Puck
      key={isLoading ? 'loading' : pageId}
      config={config(configParams)}
      data={initialData}
      onChange={handleAutoSave}
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
                variant="outline"
                title="Preview"
                size={'icon'}
                onClick={handlePreview}
                disabled={isExporting}
              >
                <Eye />
              </Button>

              <Button
                className="flex items-center pt-[7px]"
                onClick={handlePublish}
                disabled={isExporting}
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
          return <div className="puck-canvas">{children}</div>;
        },
      }}
    />
  );
}

/*
Note: config and blocks must be functions so zustand store 
can be used correctly inside them
*/
