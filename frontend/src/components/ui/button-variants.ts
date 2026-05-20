import { cva, type VariantProps } from 'class-variance-authority';

// 1. App Shell button variants (Clean, isolated, used for UI / App Shell)
export const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md text-xs leading-none font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        gray: 'bg-white text-white hover:bg-gray-400',
        neon: 'bg-neon-500 dark:bg-neon-400 text-space-600 hover:bg-space-500 hover:text-neon-500 hover:dark:text-neon-500 hover:dark:bg-space-800',
        azure: 'bg-azure-500 text-white hover:bg-azure-500/80 hover:text-space-500',
        'azure-outline':
          'border-2 border-azure-500 text-azure-500 hover:bg-azure-200 hover:border-azure-200',
        purple: 'bg-purple-500 text-white hover:bg-purple-400/80 hover:text-space-600',
        space:
          'bg-space-700 text-space-300 hover:bg-space-400/80 hover:text-space-600 dark:hover:text-space-900',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/70 hover:text-space-700',
        success: 'bg-success text-success-foreground hover:bg-success/80 hover:text-space-700',
        outline:
          'border-2 border-space-400 bg-background text-space-500 hover:bg-space-200 hover:border-space-200 ',
        muted:
          'text-space-500 dark:text-space-300 hover:bg-space-200 hover:dark:bg-space-700 hover:border-space-200 ',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-3',
        lg: 'h-14 px-9 py-4',
        sm: 'h-9 rounded-md px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'azure',
      size: 'default',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

// 2. Canvas button variants (Clean, isolated, used for Editor Canvas blocks)
export const canvasButtonVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md text-xs leading-none font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:opacity-80',
  {
    variants: {
      canvasColor: {
        primary: 'bg-primary border-primary text-primary-foreground ',
        secondary: 'bg-secondary border-secondary text-secondary-foreground ',
        tertiary: 'bg-tertiary border-tertiary text-tertiary-foreground ',
        custom: '',
      },
      canvasStyle: {
        solid: '',
        outline: 'border-2 bg-transparent',
        link: 'underline-offset-4 hover:underline bg-transparent border-none',
      },
      canvasSize: {
        xs: 'h-6 rounded-md px-2 text-xs [&_p]:text-xs [&_p]:m-0 [&_p]:leading-none',
        sm: 'h-8 rounded-md px-3 text-sm [&_p]:text-sm [&_p]:m-0 [&_p]:leading-none',
        default: 'h-10 px-4 text-base [&_p]:text-base [&_p]:m-0 [&_p]:leading-none',
        lg: 'h-14 px-9 py-4 text-lg [&_p]:text-lg [&_p]:m-0 [&_p]:leading-none',
        xl: 'h-16 px-12 py-5 text-xl [&_p]:text-xl [&_p]:m-0 [&_p]:leading-none',
        icon: 'h-10 w-10',
      },
    },
    compoundVariants: [
      // Primary + Outline
      {
        canvasColor: 'primary',
        canvasStyle: 'outline',
        class: 'bg-transparent text-primary border-primary hover:bg-primary/10',
      },
      // Primary + Link
      {
        canvasColor: 'primary',
        canvasStyle: 'link',
        class: 'text-primary',
      },
      // Secondary + Outline
      {
        canvasColor: 'secondary',
        canvasStyle: 'outline',
        class: 'bg-transparent text-secondary border-secondary hover:bg-secondary/10',
      },
      // Secondary + Link
      {
        canvasColor: 'secondary',
        canvasStyle: 'link',
        class: 'text-secondary',
      },
      // Tertiary + Outline
      {
        canvasColor: 'tertiary',
        canvasStyle: 'outline',
        class: 'bg-transparent text-tertiary border-tertiary hover:bg-tertiary/10',
      },
      // Tertiary + Link
      {
        canvasColor: 'tertiary',
        canvasStyle: 'link',
        class: 'text-tertiary',
      },
    ],
    defaultVariants: {
      canvasColor: 'primary',
      canvasStyle: 'solid',
      canvasSize: 'default',
    },
  }
);

export type CanvasButtonVariants = VariantProps<typeof canvasButtonVariants>;
