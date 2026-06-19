import MetaTags from '@/components/meta-tags';
import { ScormProvider } from '@/contexts/scorm-context';
import { queryClient } from '@/lib/react-query';
import { router } from '@/routes/routes';
import { QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { getScormConfig } from './config/course-config';
import AuthInitializer from './firebase/auth-initializer';

export default function App() {
  const { appScorm } = getScormConfig();

  if (!appScorm) {
    console.info('O ambiente SCORM está desativado');
  }

  return (
    <>
      <AuthInitializer />
      <div className="klyro-app">
        <MetaTags />
        {/* Provide the client to your App */}
        <QueryClientProvider client={queryClient}>
          {!appScorm ? (
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
      </div>
    </>
  );
}
