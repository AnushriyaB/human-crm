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

    const [view, setView] = React.useState('details'); // details | audit

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
                                    <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                                        {friend.photo ? (
                                            <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 font-bold">
                                                {friend.name?.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-primary leading-tight">{friend.name}</h2>
                                        {friend.location && <p className="text-sm text-text-secondary">{friend.location}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setView(view === 'details' ? 'audit' : 'details')}
                                        className="rounded-full text-text-secondary hover:text-brand"
                                        title="Audit Trail"
                                    >
                                        {view === 'details' ? (
                                            // Gantt / Chart Icon
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M8 12h4" /><path d="M16 8h4" /><path d="M12 16h4" /></svg>
                                        ) : (
                                            // User/Face Icon for flipping back
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        )}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                        ✕
                                    </Button>
                                </div>
                            </div>

                            {view === 'details' ? (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        {/* Details Section */}
                                        <div className="space-y-4">
                                            <DetailRow label="birthday" value={friend.birthday} />
                                            <DetailRow label="anniversary" value={friend.anniversary} />
                                            <DetailRow label="phone" value={friend.phone} />
                                            <DetailRow label="address" value={friend.address} />
                                            <DetailRow label="partner" value={friend.partner} />
                                        </div>

                                        {/* Notes Section */}
                                        {friend.notes && (
                                            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                                                <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider">notes</h3>
                                                <p className="text-text-primary whitespace-pre-wrap">{friend.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Photo Cluster Placeholder */}
                                    <div className="pt-4">
                                        <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider mb-4">photos</h3>
                                        <div className="flex -space-x-4 overflow-x-auto pb-4 pl-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md flex-shrink-0 hover:scale-110 hover:z-10 transition-transform duration-300" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Audit Trail / Gantt View
                                <div className="space-y-6">
                                    <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider mb-4">interaction history</h3>
                                    <div className="relative border-l border-gray-200 ml-3 space-y-8 pl-8">
                                        {[
                                            { date: 'Today', event: 'Viewed profile', icon: '👁️' },
                                            { date: '2 weeks ago', event: 'Sent a gift', icon: '🎁' },
                                            { date: '1 month ago', event: 'Met for coffee', icon: '☕' },
                                            { date: '3 months ago', event: 'Added to Human.', icon: '✨' },
                                        ].map((item, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[41px] bg-white border border-gray-200 text-lg rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                                                    {item.icon}
                                                </div>
                                                <p className="text-xs text-text-secondary mb-1">{item.date}</p>
                                                <p className="font-medium text-text-primary">{item.event}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
            <span className="text-text-secondary font-medium lowercase">{label}</span>
            <span className="col-span-2 text-text-primary">{value}</span>
        </div>
    );
}
