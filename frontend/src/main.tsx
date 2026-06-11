import '@//styles/global.css';

import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.tsx';

const isExportingScorm = import.meta.env.VITE_EXPORT_SCORM === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* At SCORM doesn't have dark mode */}
    {isExportingScorm ? (
      <App />
    ) : (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    )}
  </StrictMode>
);
