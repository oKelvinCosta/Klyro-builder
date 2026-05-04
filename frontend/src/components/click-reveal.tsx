/* eslint-disable react-refresh/only-export-components */
import { Button, type ButtonProps } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from 'react';
import { createContext } from 'react';

interface ClickRevealProps {
  children: ReactNode;
}

interface ClickRevealTriggerProps extends ButtonProps {
  children?: ReactNode;
}

interface ClickRevealContentProps {
  children: ReactNode;
}

interface ClickRevealHiddenProps {
  children: ReactNode;
}

interface ClickRevealContextType {
  isRevealed: boolean;
  setIsRevealed: Dispatch<SetStateAction<boolean>>;
}

// Context to share the reveal state and function
const ClickRevealContext = createContext<ClickRevealContextType | null>(null);

// Hook to access the context only inside of it
export function useClickRevealContext() {
  const ctx = useContext<ClickRevealContextType | null>(ClickRevealContext);
  if (!ctx) {
    throw new Error('useClickRevealContext deve ser usado dentro de <ClickRevealContext>');
  }
  return ctx;
}

// Container for the revealable content
const ClickReveal = ({ children, ...props }: ClickRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <ClickRevealContext.Provider value={{ isRevealed, setIsRevealed }}>
      <div {...props}>{children}</div>
    </ClickRevealContext.Provider>
  );
};

// Trigger to reveal or hide content
const ClickRevealTrigger = ({ children, ...props }: ClickRevealTriggerProps) => {
  const { setIsRevealed, isRevealed } = useClickRevealContext();

  function handleClick() {
    setIsRevealed(!isRevealed);
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`my-4 gap-2`}
      type="button"
      {...props}
    >
      {isRevealed ? (
        <>
          <EyeOffIcon className="h-4 w-4" />
          {children || 'Esconder'}
        </>
      ) : (
        <>
          <EyeIcon className="h-4 w-4" />
          {children || 'Revelar'}
        </>
      )}
    </Button>
  );
};

// Content that is always visible
const ClickRevealContent = ({ children, ...props }: ClickRevealContentProps) => {
  return <div {...props}>{children}</div>;
};

// Content that is hidden when not revealed
const ClickRevealHidden = ({ children, ...props }: ClickRevealHiddenProps) => {
  const { isRevealed } = useClickRevealContext();

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${isRevealed ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      {...props}
      aria-hidden={!isRevealed}
    >
      <div className="py-2">{children}</div>
    </div>
  );
};

export { ClickReveal, ClickRevealContent, ClickRevealHidden, ClickRevealTrigger };  
