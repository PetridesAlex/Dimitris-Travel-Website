import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        gold: 'bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)]',
        dark: 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-charcoal)]',
        outline:
          'border border-white/80 bg-transparent text-white hover:bg-white hover:text-[var(--color-ink)]',
        outlineDark:
          'border border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white',
        ghost: 'bg-transparent text-white hover:text-[var(--color-gold)]',
        admin:
          'rounded-md bg-[var(--color-gold)] px-4 py-2 normal-case tracking-normal text-[var(--color-ink)] hover:bg-[var(--color-gold-dark)] hover:text-white',
        adminOutline:
          'rounded-md border border-[var(--admin-border)] bg-white px-4 py-2 normal-case tracking-normal text-[var(--admin-text)] hover:bg-[var(--admin-bg)]',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'gold',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
