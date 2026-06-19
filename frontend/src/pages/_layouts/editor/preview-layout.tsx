import { Button } from '@/components/ui/button';
import { useEditorMode } from '@/editor/stores/editor-mode-store';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function PreviewLayout() {
  const navigate = useNavigate();
  const { setMode } = useEditorMode();

  useEffect(() => {
    setMode('preview');
  }, [setMode]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Editor Header */}

      <div className="flex items-center justify-between bg-gray-900 px-6 py-3 shadow-md">
        <h2 className="!mb-0 text-sm font-semibold text-gray-400">Editor Preview Mode</h2>
        <Button className="flex items-center" variant="space" onClick={() => navigate(-1)}>
          <ChevronLeft /> Voltar
        </Button>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
