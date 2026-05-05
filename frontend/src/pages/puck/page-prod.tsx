import { Spinner } from '@/components/ui/spinner';
import { config } from '@/editor/puck.config';
import { Render, type Data } from '@puckeditor/core';
import { useEffect, useState } from 'react';

/**
 * Page component that renders static Puck data from a SCORM-generated JSON file.
 * Uses native fetch since the file path is only known at runtime (per-user temp folder).
 */
export function PageProd() {
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
      .then((json) => setData(json as Data))
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
    <div className="animate-in fade-in duration-700">
      <Render config={puckConfig} data={data} />
    </div>
  );
}
