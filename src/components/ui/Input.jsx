import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
