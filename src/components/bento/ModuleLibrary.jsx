import React from 'react';
import { motion } from 'framer-motion';
import {
    Heart, Calendar, Sparkles, Briefcase, MessageCircle,
    BookOpen, PenTool, Check
} from 'lucide-react';

const MODULES = [
    {
        type: 'family',
        title: 'Family',
        description: 'Partner, kids, pets, key people in their life.',
        icon: Heart,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10'
    },
    {
        type: 'timeline',
        title: 'Timeline',
        description: 'Birthday, anniversary, important dates, last contact.',
        icon: Calendar,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    },
    {
        type: 'favorites',
        title: 'Favorites',
        description: 'Food, drinks, music, hobbies, gift ideas.',
        icon: Sparkles,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        type: 'work',
        title: 'Work',
        description: 'Job, company, skills, aspirations.',
        icon: Briefcase,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10'
    },
    {
        type: 'communication',
        title: 'Communication',
        description: 'Contact info, preferred channels, check-in cadence.',
        icon: MessageCircle,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        type: 'story',
        title: 'Story',
        description: 'Background, values, goals, current challenges.',
        icon: BookOpen,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        type: 'notes',
        title: 'Notes',
        description: 'Free-draw canvas for sketches and doodles.',
        icon: PenTool,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    }
];

export default function ModuleLibrary({ isOpen, onClose, onSelect, existingModules = [], isMe = false }) {
    if (!isOpen) return null;

    // Filter modules based on whether this is "me" or a friend
    // For "me", we don't need family, communication, or story modules (those are for tracking others)
    const availableModules = isMe
        ? MODULES.filter(m => ['timeline', 'favorites', 'work', 'notes'].includes(m.type))
        : MODULES;

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
                    {availableModules.map((mod) => {
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
