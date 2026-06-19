import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to load project and your pages with optimized caching
 * Fetches data only once per session to prevent unnecessary requests
 */
export function usePageLoader(projectId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['Project', projectId],
    queryFn: async () => {
      console.trace('🔴 PAGE FETCH TRIGGERED'); // Debug trace
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    },
    staleTime: Infinity, // Only fetch once per session
    gcTime: Infinity, // Keep cache while tab is open
    refetchOnWindowFocus: false, // Don't refetch when returning to tab
    refetchOnReconnect: false, // Don't refetch on internet reconnection
    refetchOnMount: false, // don't refetch when component remounts if cache exists
  });

  return {
    data,
    isLoading,
    isError,
    projectId,
  };
}
