import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full rounded-[2px] border border-transparent px-4 py-2 text-left shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            style={{
                backgroundColor: 'var(--color-button-bg)',
                color: 'var(--color-text-primary)'
            }}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
