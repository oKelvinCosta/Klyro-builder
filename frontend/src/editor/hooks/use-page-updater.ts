import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Data payload accepted by the page/project update endpoint.
 *
 * This hook supports partial updates so callers can send only the fields
 * they need. The `project` block is used for project-level metadata such as
 * the title, slug, theme, and text styles. The `page` block is used for the
 * current page content and page metadata.
 */
interface DataToUpdate {
  project?: {
    title?: string;
    slug?: string;
    cover?: string;
    theme?: Record<string, any>;
    textStyles?: unknown[];
  };
  page?: {
    title?: string;
    slug?: string;
    puckData?: object;
  };
  /** Skip the success toast for silent saves, such as autosave flows. */
  silent?: boolean;
}

/**
 * Hook that persists editor changes for the current project and page.
 *
 * How it works:
 * - Reads `projectId` and `pageId` from the route.
 * - Sends a `PATCH /projects/:projectId/:pageId` request with the provided
 *   partial payload.
 * - Updates the React Query cache for `['Project', projectId]` so the editor
 *   UI can reflect the saved values immediately.
 * - Optionally shows a success toast unless the caller passes `silent: true`.
 *
 * Typical usage:
 * - Project title changes from the config panel.
 * - Autosaved page content from the canvas.
 * - Theme and text-style updates from the editor sidebar.
 */
export function usePageUpdater() {
  const { projectId, pageId } = useParams();
  const queryClient = useQueryClient();

  const updatePage = useMutation({
    mutationFn: ({ silent: _silent, ...data }: DataToUpdate) =>
      api.patch(`/projects/${projectId}/${pageId}`, data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['Project', projectId], (old: any) => {
        if (!old) return old;

        // Merge the updated project fields without dropping any existing data.
        const updatedProject = variables.project
          ? { ...old.project, ...variables.project }
          : old.project;

        // The current page is stored under `firstPage` in the cached project payload.
        const updatedFirstPage = variables.page
          ? { ...old.firstPage, ...variables.page }
          : old.firstPage;

        return {
          ...old,
          project: updatedProject,
          firstPage: updatedFirstPage,
        };
      });
      if (!variables.silent) {
        toast.success('Saved');
      }
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
