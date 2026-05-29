/**
 * Saved project text styles: list, apply, delete, and "+ Novo" to capture current formatting.
 */
import { Button } from '@/components/ui/button';
import type { TextStylePreset } from '@/editor/stores/use-text-styles-store';
import { Trash2 } from 'lucide-react';
import { applyPresetToEditor, capturePresetSnapshot } from './preset-commands';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PresetsPanelProps = {
  editor: any;
  presets: TextStylePreset[];
  onSavePreset: (preset: { name: string; styles: ReturnType<typeof capturePresetSnapshot> }) => void;
  onDeletePreset: (id: string) => void;
};

export function PresetsPanel({ editor, presets, onSavePreset, onDeletePreset }: PresetsPanelProps) {
  const handleSavePreset = () => {
    const name = prompt('Nome do estilo (ex: Destaque Rosa):');
    if (!name) return;
    onSavePreset({ name, styles: capturePresetSnapshot(editor) });
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between">
        <span className="text-mute text-[10px] font-bold uppercase">Estilos Salvos</span>
        <Button variant="link" size="sm" className="h-6 text-[10px]" onClick={handleSavePreset}>
          + Novo
        </Button>
      </div>
      {presets.length === 0 ? (
        <p className="py-2 text-center text-[10px] italic text-slate-400">Nenhum estilo salvo</p>
      ) : (
        <div className="flex flex-col gap-1">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between rounded bg-white p-1.5 shadow-sm"
            >
              <button
                onClick={() => applyPresetToEditor(editor, preset.styles)}
                className="flex-1 text-left text-xs font-medium text-slate-700"
              >
                {preset.name}
              </button>
              <button
                onClick={() => onDeletePreset(preset.id)}
                className="p-1 text-slate-300 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
