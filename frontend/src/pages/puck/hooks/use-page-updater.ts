import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function usePageUpdater() {
  const { projectId, pageId } = useParams();
  const queryClient = useQueryClient();

  const updatePage = useMutation({
    mutationFn: (data: { page: { puckData: object } }) =>
      api.patch(`/projects/${projectId}/${pageId}`, data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['Project', projectId], (old: any) => ({
        ...old,
        ...variables,
      }));
      console.log('Project saved successfully!');
      toast.success('Project saved successfully!');
    },
    onError: (error) => {
      toast.error('Error saving Project');
      console.error('Save error:', error);
    },
  });

  return {
    updatePage,
    isSaving: updatePage.isPending,
  };
}
