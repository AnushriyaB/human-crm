import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

export default function SettingsModal({ isOpen, onClose }) {
    const [digestFrequency, setDigestFrequency] = useState('weekly');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden p-6 space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-primary">Settings</h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                                ✕
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary block mb-3">Digest Frequency</label>
                                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl">
                                    {['daily', 'weekly'].map((freq) => (
                                        <button
                                            key={freq}
                                            onClick={() => setDigestFrequency(freq)}
                                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${digestFrequency === freq
                                                ? 'bg-white text-brand shadow-sm'
                                                : 'text-text-secondary hover:text-text-primary'
                                                }`}
                                        >
                                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-text-secondary mt-2">
                                    Receive updates about your friends {digestFrequency}.
                                </p>
                            </div>
                        </div>

                        <Button className="w-full" onClick={onClose}>
                            Done
                        </Button>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
