import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function usePageUpdater() {
  const { pageId } = useParams();
  const queryClient = useQueryClient();

  const updatePage = useMutation({
    mutationFn: (data: { puckData: object }) => api.put(`/pages/${pageId}`, data),
    onSuccess: (_, variables) => {
      // Atualiza o cache com o dado que acabou de ser salvo
      queryClient.setQueryData(['Page', pageId], (old: any) => ({
        ...old,
        ...variables,
      }));

      console.log('Page saved successfully!');
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
