import { Button } from '@/components/ui/button';
import { RotateCcw, Save, Server } from 'lucide-react';

export function SnapshotPanel() {
  return (
    <div className="bg-background/50 flex h-full flex-col">
      {/* Panel Header */}
      <div className="flex items-center gap-2 border-b border-white/5 p-4">
        <Server className="text-primary size-4" />
        <h3 className="text-muted-foreground mb-0 text-xs font-bold uppercase tracking-widest">
          Snapshots
        </h3>
      </div>

      {/* Main Content Area: Grouped Settings in Accordions */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4 [&_h3]:mb-0">Snapshots aqui</div>

      {/* Footer Actions: Reset and Apply Changes */}
      <div className="bg-background/80 sticky bottom-0 border-t border-white/5 p-4 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="muted" size="sm" className="h-9 text-xs">
            <RotateCcw className="mr-2 size-3.5" />
            Resetar
          </Button>
          <Button variant="neon" size="sm" className="h-9 text-xs">
            <Save className="mr-2 size-3.5" />
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
