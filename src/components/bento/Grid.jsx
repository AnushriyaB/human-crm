import React from 'react';
import clsx from 'clsx';

export default function BentoGrid({ children, className }) {
    return (
        <div className={clsx(
            "grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min",
            className
        )}>
            {children}
        </div>
    );
}
