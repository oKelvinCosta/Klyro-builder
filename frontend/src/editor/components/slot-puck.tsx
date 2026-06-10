// @/editor/utils/puck-slot.tsx
import { useEditorMode } from '@/editor/stores/editor-mode-store';

interface SlotPuckProps {
  Slot: React.ElementType;
  style?: React.CSSProperties;
}

export const SlotPuck = ({ Slot, style, ...props }: SlotPuckProps) => {
  const { isEditing } = useEditorMode();

  const editorCss = isEditing ? '1rem' : '';

  return (
    <Slot
      style={{
        width: '100%',
        padding: editorCss,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        ...style,
      }}
      {...props}
    />
  );
};
