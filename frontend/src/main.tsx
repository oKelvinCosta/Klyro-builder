import '@//styles/global.css';

import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.tsx';

const isWithoutScormBuild = import.meta.env.VITE_APP_WITHOUT_SCORM === 'false';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* At SCORM doesn't have dark mode */}
    {isWithoutScormBuild ? (
      <App />
    ) : (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    )}
  </StrictMode>
);
