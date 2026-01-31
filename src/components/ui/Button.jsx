import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', loading = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none lowercase";

    const variants = {
        primary: "bg-brand text-white rounded-[4px] shadow-[inset_0_-3px_6px_0_rgba(0,0,0,0.2),inset_0_3px_6px_0_rgba(255,255,255,0.3)] hover:shadow-[inset_0_3px_6px_0_rgba(0,0,0,0.2),inset_0_-3px_6px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_4px_10px_0_rgba(0,0,0,0.4)]",
        secondary: "rounded-[2px] bg-[var(--color-button-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)] active:shadow-active",
        link: "text-brand underline-offset-4 hover:underline",
    };

    const sizes = {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-10 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
            ) : (
                children
            )}
        </button>
    );
});
Button.displayName = "Button";

export { Button };
