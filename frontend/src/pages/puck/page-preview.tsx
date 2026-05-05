import { Spinner } from '@/components/ui/spinner';
import { config } from '@/editor/puck.config';
import { Render } from '@puckeditor/core';
import { useParams } from 'react-router-dom';
import { usePageLoader } from './hooks/use-page-loader';

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
  const { pageId } = useParams();
  const { data: pageData, isLoading, isError } = usePageLoader(pageId);

  const puckConfig = config({ projectType: 'choices' });

  const data = pageData?.puckData?.page ?? emptyData;

  if (isLoading) return <Spinner />;
  if (isError || !pageData) return <div>Erro ao carregar preview.</div>;

  return <Render config={puckConfig} data={data} />;
}
