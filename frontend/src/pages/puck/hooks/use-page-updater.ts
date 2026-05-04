import { api } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook to handle page updates with auto-save functionality
 * Provides save mutation with success/error feedback
 */
export function usePageUpdater() {
  const { pageId } = useParams();

  const updatePage = useMutation({
    mutationFn: (data: { puckData: object }) => api.put(`/pages/${pageId}`, data),
    onSuccess: () => {
      toast.success('Page saved successfully!');
    },
    onError: (error) => {
      toast.error('Error saving page');
      console.error('Save error:', error);
    },
  });

  return {
    updatePage,
    isSaving: updatePage.isPending,
  };
}
