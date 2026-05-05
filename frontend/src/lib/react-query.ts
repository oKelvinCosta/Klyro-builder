import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient();

// TanStack Query DevTools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
