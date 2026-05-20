import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  buttonVariants,
  type ButtonVariants,
  canvasButtonVariants,
  type CanvasButtonVariants,
} from './button-variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants,
    Partial<CanvasButtonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      canvasColor,
      canvasStyle,
      canvasSize,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // If any canvas-specific variants are passed, we resolve using the isolated canvasButtonVariants.
    // This completely bypasses the standard buttonVariants and its default variant/size configs, avoiding conflicts.
    const resolvedClasses =
      canvasColor || canvasStyle || canvasSize
        ? canvasButtonVariants({ canvasColor, canvasStyle, canvasSize, className })
        : buttonVariants({ variant, size, className });

    return (
      <Comp
        className={cn(resolvedClasses)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
