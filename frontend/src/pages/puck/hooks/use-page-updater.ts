import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface DataToUpdate {
  project?: {
    title?: string;
    slug?: string;
    cover?: string;
    theme?: Record<string, any>;
  };
  page?: {
    title?: string;
    slug?: string;
    puckData?: object;
  };
}

export function usePageUpdater() {
  const { projectId, pageId } = useParams();
  const queryClient = useQueryClient();

  const updatePage = useMutation({
    mutationFn: (data: DataToUpdate) => api.patch(`/projects/${projectId}/${pageId}`, data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['Project', projectId], (old: any) => {
        if (!old) return old;

        // Mescla de forma segura as propriedades novas do projeto sem apagar as antigas
        const updatedProject = variables.project
          ? { ...old.project, ...variables.project }
          : old.project;

        // In the cache, the page is stored under `firstPage` (from GET /projects/:id response)
        const updatedFirstPage = variables.page
          ? { ...old.firstPage, ...variables.page }
          : old.firstPage;

        return {
          ...old,
          project: updatedProject,
          firstPage: updatedFirstPage,
        };
      });
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
