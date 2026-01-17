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
                        className="absolute top-full left-0 mt-2 bg-white rounded-[2px] shadow-xl border border-gray-100 overflow-hidden z-50 w-48 pointer-events-auto"
                    >
                        <div className="p-2">
                            {/* Visual Toggle */}
                            <div className="flex bg-gray-50 rounded-xl p-1 relative">
                                <motion.div
                                    className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm"
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
                                    className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors lowercase cursor-pointer ${frequency === 'weekly' ? 'text-text-primary' : 'text-text-secondary'}`}
                                >
                                    weekly
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFrequency('daily')}
                                    className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors lowercase cursor-pointer ${frequency === 'daily' ? 'text-text-primary' : 'text-text-secondary'}`}
                                >
                                    daily
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
