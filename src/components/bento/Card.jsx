import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function BentoCard({ children, className, title, icon: Icon, onEdit, headerAction, onClick }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className={clsx(
                "group relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4 overflow-hidden",
                "hover:border-[var(--color-highlight)] transition-colors duration-200",
                className
            )}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    {Icon && <Icon size={16} />}
                    <h3 className="text-xs font-semibold uppercase tracking-wider">{title}</h3>
                </div>
                {headerAction}
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
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
