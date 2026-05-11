import { cn } from '@/lib/utils';
import * as React from 'react';

/* ADDED: size support mapped to Tailwind's 16/18/24 tokens */
type TextSize = 16 | 18 | 24;
const sizeToClasses: Record<TextSize, string> = {
  16: 'text-base leading-6 [&_p]:m-0 [&_p]:text-base [&_li]:text-base [&_span]:text-base',
  18: 'text-lg leading-7   [&_p]:m-0 [&_p]:text-lg   [&_li]:text-lg   [&_span]:text-lg',
  24: 'text-2xl leading-8  [&_p]:m-0 [&_p]:text-2xl  [&_li]:text-2xl  [&_span]:text-2xl',
};

/* Custom classes */
const customClasses = {
  card: 'p-6 flex flex-col',
  childImgs: '[&_img]:rounded-lg',
  childText: '',
  header: 'p-0 gap-2',
  content: 'p-0',
  footer: 'p-0',
};

/* ADDED: variant prop */
type Variant = 'default' | 'gray';

/* ADDED: shared variant classes */
const variantClasses: Record<Variant, string> = {
  default: 'border dark:border-space-600 bg-card text-card-foreground',
  gray: 'border-gray-200 bg-gray-100 text-gray-800',
};

/* ADDED: size + variant prop for Card/HorizontalCard */
type DivProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: TextSize;
  variant?: Variant;
};

const HorizontalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: TextSize;
    variant?: Variant;
    side?: 'left' | 'right'; // NEW
  }
>(({ className, children, size = 16, variant = 'default', side = 'left', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base layout
      'flex flex-col items-center gap-4 rounded-lg border p-4',

      // 🔥 Image on left or right
      side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',

      // Styling
      variantClasses[variant],
      customClasses.childImgs,
      customClasses.childText,
      sizeToClasses[size],

      className
    )}
    {...props}
  >
    {children}
  </div>
));
HorizontalCard.displayName = 'HorizontalCard';

const Card = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, size = 16, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border',
        variantClasses[variant], // ADDED
        customClasses.card,
        customClasses.childImgs,
        customClasses.childText,
        sizeToClasses[size],
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', customClasses.header, className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-primary mb-2 border-gray-200 font-semibold leading-snug tracking-tight',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(customClasses.content, className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-3', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, HorizontalCard };
