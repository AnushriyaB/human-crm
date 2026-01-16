import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export default function SideSheet({ isOpen, onClose, friend }) {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && friend && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-border"
                    >
                        <div className="p-6 md:p-8 space-y-8">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white shadow-lg" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-primary leading-tight">{friend.name}</h2>
                                        {friend.location && <p className="text-sm text-text-secondary">{friend.location}</p>}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                    ✕
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Details Section */}
                                <div className="space-y-4">
                                    <DetailRow label="Birthday" value={friend.birthday} />
                                    <DetailRow label="Anniversary" value={friend.anniversary} />
                                    <DetailRow label="Phone" value={friend.phone} />
                                    <DetailRow label="Address" value={friend.address} />
                                    <DetailRow label="Partner" value={friend.partner} />
                                </div>

                                {/* Notes Section */}
                                {friend.notes && (
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Notes</h3>
                                        <p className="text-text-primary whitespace-pre-wrap">{friend.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Photo Cluster Placeholder */}
                            <div className="pt-4">
                                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Photos</h3>
                                <div className="flex -space-x-4 overflow-x-auto pb-4 pl-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md flex-shrink-0 hover:scale-110 hover:z-10 transition-transform duration-300" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function DetailRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3 last:border-0 text-sm">
            <span className="text-text-secondary font-medium">{label}</span>
            <span className="col-span-2 text-text-primary">{value}</span>
        </div>
    );
}
