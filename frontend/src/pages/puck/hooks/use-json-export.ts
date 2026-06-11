import { api } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

type ExportProjectPayload = {
  title?: string;
  slug?: string;
  theme?: Record<string, unknown>;
  textStyles?: unknown[];
};

type ExportPayload = {
  puckData: unknown;
  project?: ExportProjectPayload;
};

const getFileNameFromHeader = (contentDisposition?: string) => {
  if (!contentDisposition) return 'SCORM_package.zip';

  const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8FileNameMatch?.[1]) {
    return decodeURIComponent(utf8FileNameMatch[1]);
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return fileNameMatch?.[1] ?? 'SCORM_package.zip';
};

export function useJsonExport() {
  const mutation = useMutation({
    mutationFn: async (data: ExportPayload) => {
      const response = await api.post(`/export/puck-data`, data, {
        responseType: 'blob',
      });
      return response;
    },
    onSuccess: (response) => {
      const data = response.data;
      const fileName = getFileNameFromHeader(response.headers['content-disposition']);

      // Create a URL for the blob
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.info(`SCORM ${fileName} baixado com sucesso!`);
    },
    onError: (error) => {
      console.error('Erro ao baixar SCORM:', error);
      alert('Erro ao baixar SCORM. Verifique o console.');
    },
  });

  return {
    saveJsonFile: mutation.mutateAsync,
    isExporting: mutation.isPending,
  };
}
