import MetaTags from '@/components/meta-tags';
import { ScormProvider } from '@/contexts/scorm-context';
import { queryClient } from '@/lib/react-query';
import { router } from '@/routes/routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function App() {
  if (import.meta.env.VITE_APP_WITHOUT_SCORM === 'true') {
    console.info('O ambiente SCORM está desativado');
  }

  return (
    <>
      <MetaTags />

      {/* Provide the client to your App */}
      <QueryClientProvider client={queryClient}>
        {import.meta.env.VITE_APP_WITHOUT_SCORM === 'true' ? (
          <>
            <RouterProvider router={router} />
          </>
        ) : (
          <>
            <ScormProvider>
              <RouterProvider router={router} />
            </ScormProvider>
          </>
        )}
      </QueryClientProvider>

      {/* Toast container */}
      <Toaster />
    </>
  );
}
