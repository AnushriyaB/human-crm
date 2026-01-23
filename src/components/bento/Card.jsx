import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function BentoCard({
    children,
    className,
    title,
    icon: Icon,
    onEdit,
    headerAction,
    onClick,
    onRemove,
    isEditing,
    isNew
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={clsx(
                "group relative rounded-2xl p-5 overflow-hidden transition-all duration-200",
                "border border-transparent hover:border-[var(--color-border)] hover:bg-blue-50/40",
                isNew
                    ? "bg-blue-50/50 border-blue-100"
                    : "bg-[var(--color-card-bg)]",
                className
            )}
        >
            {title && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                        {Icon && <Icon size={16} />}
                        <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                        {headerAction}
                        {isEditing && onRemove && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove();
                                }}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                                title="Remove tile"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--color-bg-secondary)] rounded transition-all"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
