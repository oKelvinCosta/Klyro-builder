import { Spinner } from '@/components/ui/spinner';
import { CanvasWrapper } from '@/editor/components/canvas-wrapper';
import { config } from '@/editor/puck.config';
import { useThemeStore } from '@/editor/stores/use-canvas-theme-store';
import '@/styles/canvas.css';
import { Render } from '@puckeditor/core';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageLoader } from '../../editor/hooks/use-page-loader';

const emptyData = {
  root: { props: {} },
  content: [],
  zones: {},
};

/**
 * Page component that renders static Puck data.
 * The React Compiler automatically handles memoization for this component and its values.
 */
export function PagePreview() {
  const { pageId: projectId } = useParams();
  const { data, isLoading, isError } = usePageLoader(projectId!);

  useLayoutEffect(() => {
    if (!data) return;

    useThemeStore.getState().hydrateTheme(data.project?.theme);
  }, [data]);

  const puckConfig = config({ projectType: 'choices' });

  const firstPage = data?.firstPage;
  const dataRender = firstPage?.puckData ?? emptyData;

  if (isLoading) return <Spinner />;
  if (isError || !data) return <div>Erro ao carregar preview.</div>;

  return (
    <CanvasWrapper>
      <Render config={puckConfig} data={dataRender} />
    </CanvasWrapper>
  );
}
