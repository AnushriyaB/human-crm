import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsDropdown({ isOpen, onClose }) {
    // Local state for demo purposes, in real app this would sync with context/backend
    const [frequency, setFrequency] = useState('weekly');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible backdrop to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }} // Linear animation
                        className="absolute top-full right-0 mt-2 rounded-[2px] shadow-xl overflow-hidden z-50 w-48 pointer-events-auto"
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            borderColor: 'var(--color-border)',
                            borderWidth: '1px',
                            borderStyle: 'solid'
                        }}
                    >
                        <div className="p-3 space-y-2">
                            {/* Label */}
                            <p className="text-xs text-[var(--color-text-secondary)] font-medium px-1">Digest Frequency</p>
                            {/* Visual Toggle */}
                            <div className="flex rounded-[2px] p-1 relative" style={{ backgroundColor: 'var(--color-button-bg)' }}>
                                <motion.div
                                    className="absolute top-1 bottom-1 rounded-[2px] shadow-sm"
                                    style={{ backgroundColor: 'var(--color-highlight)' }}
                                    initial={false}
                                    animate={{
                                        left: frequency === 'weekly' ? '4px' : '50%',
                                        width: 'calc(50% - 4px)'
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFrequency('weekly')}
                                    className="flex-1 relative z-10 py-2 text-sm font-medium transition-colors lowercase cursor-pointer"
                                    style={{
                                        color: frequency === 'weekly' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                                    }}
                                >
                                    weekly
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFrequency('daily')}
                                    className="flex-1 relative z-10 py-2 text-sm font-medium transition-colors lowercase cursor-pointer"
                                    style={{
                                        color: frequency === 'daily' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                                    }}
                                >
                                    daily
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
