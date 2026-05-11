import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  ' flex items-center justify-center whitespace-nowrap rounded-md text-xs leading-none font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        gray: 'bg-white text-white hover:bg-gray-400',
        neon: 'bg-neon-500 dark:bg-neon-400 text-space-600 hover:bg-space-500 hover:text-neon-500 hover:dark:text-neon-500 hover:dark:bg-space-800',
        azure: 'bg-azure-500 text-white hover:bg-azure-500/80 hover:text-space-500',
        'azure-outline':
          'border-2 border-azure-500 text-azure-500 hover:bg-azure-200 hover:border-azure-200',
        purple: 'bg-purple-500 text-white hover:bg-purple-400/80 hover:text-space-600',
        space: 'bg-space-700 text-space-300 hover:bg-space-400/80 hover:text-space-600',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/70 hover:text-space-700',
        success: 'bg-success text-success-foreground hover:bg-success/80 hover:text-space-700',
        outline:
          'border-2 border-space-400 bg-background text-space-500 hover:bg-space-200 hover:border-space-200 ',
        muted:
          'text-space-500 dark:text-space-300 hover:bg-space-200 hover:dark:bg-space-700 hover:border-space-200 ',
        link: 'text-secondary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9  px-3',
        lg: 'h-14 px-9 py-4 text-base',
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
