import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full rounded-xl border border-border px-4 py-2 text-left shadow-inner transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            style={{
                backgroundColor: 'var(--color-card-bg)',
                color: 'var(--color-text-primary)'
            }}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
