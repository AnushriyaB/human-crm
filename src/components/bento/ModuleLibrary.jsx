import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, Share2, FileText, Check, Heart, Briefcase, Sparkles, BookOpen } from 'lucide-react';

const MODULES = [
    {
        type: 'family',
        title: 'Family Circle',
        description: 'Partner, children, and pets.',
        icon: Heart,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10'
    },
    {
        type: 'dates',
        title: 'Important Dates',
        description: 'Birthdays, anniversaries, and countdowns.',
        icon: Calendar,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    },
    {
        type: 'work',
        title: 'Professional',
        description: 'Company, role, work contacts.',
        icon: Briefcase,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10'
    },
    {
        type: 'preferences',
        title: 'Favorites',
        description: 'Food, colors, music, hobbies, gift ideas.',
        icon: Sparkles,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        type: 'memories',
        title: 'Our Story',
        description: 'How you met, favorite memories, notes.',
        icon: BookOpen,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        type: 'social',
        title: 'The Web',
        description: 'Social media links and websites.',
        icon: Share2,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        type: 'financial',
        title: 'Financial Vault',
        description: 'Bank details, payment handles, secure notes.',
        icon: DollarSign,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    }
];

export default function ModuleLibrary({ isOpen, onClose, onSelect, existingModules = [] }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-full max-w-md bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
                    <h2 className="font-bold text-lg lowercase">add a tile</h2>
                    <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">✕</button>
                </div>

                <div className="p-4 grid gap-2 max-h-[60vh] overflow-y-auto">
                    {MODULES.map((mod) => {
                        const isAdded = existingModules.some(m => m.type === mod.type);
                        return (
                            <button
                                key={mod.type}
                                onClick={() => {
                                    if (!isAdded) onSelect(mod.type);
                                }}
                                disabled={isAdded}
                                className={`flex items-start gap-4 p-3 rounded-xl text-left transition-all border border-transparent ${isAdded
                                    ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
                                    : 'hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border)]'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-lg ${mod.bg} ${mod.color}`}>
                                    <mod.icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm lowercase">{mod.title}</h3>
                                        {isAdded && <Check size={14} className="text-green-500" />}
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 lowercase">{mod.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
