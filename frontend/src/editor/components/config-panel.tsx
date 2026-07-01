import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePageUpdater } from '@/editor/hooks/use-page-updater';
import { Cog, RotateCcw, Save, Users } from 'lucide-react';
import { useState } from 'react';

interface ConfigPanelProps {
  /** Current committed project title used by the editor header. */
  projectTitle: string;
  /** Updates the committed project title in the parent editor shell. */
  setProjectTitle: (value: string) => void;
}

/**
 * Sidebar panel responsible for editing project-level settings.
 *
 * Title workflow:
 * - `projectTitle` is the committed value received from `PageEditor`.
 * - `draftTitle` is the local input value used while typing.
 * - Clicking "Aplicar" saves the title to the backend and then commits the
 *   draft to the parent state so the header updates in one step.
 */
export function ConfigPanel({ projectTitle, setProjectTitle }: ConfigPanelProps) {
  const { updatePage } = usePageUpdater();
  const [draftTitle, setDraftTitle] = useState(projectTitle);

  const handleSave = () => {
    const nextTitle = draftTitle.trim();

    updatePage.mutate(
      {
        project: {
          title: nextTitle,
        },
      },
      {
        onSuccess: () => {
          setProjectTitle(nextTitle);
        },
      }
    );
  };

  return (
    <div className="bg-background/50 flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/5 p-4">
        <Cog className="text-primary size-4" />
        <h3 className="text-muted-foreground mb-0 text-xs font-bold uppercase tracking-widest">
          Configurações do Projeto
        </h3>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4 [&_h3]:mb-0">
        <div className="space-y-2">
          <Label htmlFor="project-title" className="text-xs font-bold uppercase tracking-widest">
            Nome do projeto
          </Label>
          <Input
            id="project-title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Digite o nome do projeto"
            className="h-9 text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest">Colaboradores</span>
          <Button variant="neon" size="sm">
            <Users className="mr-2 size-3.5" />
            Convidar
          </Button>
        </div>

        <AvatarGroup className="grayscale">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>

      <div className="bg-background/80 sticky bottom-0 border-t border-white/5 p-4 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="muted" size="sm" className="h-9 text-xs">
            <RotateCcw className="mr-2 size-3.5" />
            Resetar
          </Button>
          <Button variant="neon" size="sm" className="h-9 text-xs" onClick={handleSave}>
            <Save className="mr-2 size-3.5" />
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
