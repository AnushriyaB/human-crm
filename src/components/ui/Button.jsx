import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";

    const variants = {
        primary: "bg-brand text-white hover:bg-brand/90",
        secondary: "bg-gray-100 text-text-primary hover:bg-gray-200",
        outline: "border border-border bg-transparent hover:bg-gray-50 text-text-primary",
        ghost: "hover:bg-gray-100 text-text-primary",
        link: "text-brand underline-offset-4 hover:underline",
    };

    const sizes = {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-10 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
});
Button.displayName = "Button";

export { Button };
