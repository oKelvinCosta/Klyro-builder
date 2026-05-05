import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to load page data with optimized caching
 * Fetches data only once per session to prevent unnecessary requests
 */
export function usePageLoader(pageId: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['Page', pageId],
    queryFn: async () => {
      console.trace('🔴 PAGE FETCH TRIGGERED'); // Debug trace
      const response = await api.get(`/pages/${pageId}`);
      return response.data;
    },
    staleTime: Infinity, // Only fetch once per session
    gcTime: Infinity, // Keep cache while tab is open
    refetchOnWindowFocus: false, // Don't refetch when returning to tab
    refetchOnReconnect: false, // Don't refetch on internet reconnection
    refetchOnMount: false, // Don't refetch when component remounts
  });

  return {
    data,
    isLoading,
    isError,
    pageId,
  };
}
