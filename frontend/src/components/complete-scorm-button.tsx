import { Button } from '@/components/ui/button';
import { LESSON_STATUS } from '@/constants/scorm';
import { useScorm } from '@/contexts/scorm-context';

import type { ButtonProps } from '@/components/ui/button';

interface CompleteScormButtonProps extends ButtonProps {
  text?: string;
}

export default function CompleteScormButton({
  text = 'Concluir',
  ...props
}: CompleteScormButtonProps) {
  const { scormSet, scormSave, scormQuit, scormGet } = useScorm();

  function handleConcludeScorm() {
    scormSet('cmi.core.lesson_status', LESSON_STATUS.completed);
    scormSave();
    scormQuit();
  }

  const isCourseCompleted = scormGet('cmi.core.lesson_status') === LESSON_STATUS.completed;

  return (
    <Button onClick={handleConcludeScorm} disabled={isCourseCompleted} {...props}>
      {text || 'Concluir'}
    </Button>
  );
}
