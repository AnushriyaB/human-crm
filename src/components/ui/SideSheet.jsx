import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Icons } from './Icons';
import { useFriends } from '../../context/FriendContext';
import { DynamicInput } from './DynamicInput';

export default function SideSheet({ isOpen, onClose, friend }) {
    const navigate = useNavigate();
    const { updateFriend } = useFriends();

    // Simple way to handle updates: 
    // When input blurs, save update.
    const handleUpdate = (field, value) => {
        if (!friend) return;
        updateFriend(friend.id, { [field]: value });
    };

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
                                        {(friend.photos?.[0] || friend.photo) ? (
                                            <img src={friend.photos?.[0] || friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 font-bold">
                                                {friend.name?.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        {/* Inline Edit Name */}
                                        <DynamicInput
                                            value={friend.name}
                                            onChange={(e) => handleUpdate('name', e.target.value)}
                                            className="text-2xl font-bold text-text-primary leading-tight lowercase"
                                            placeholder="name"
                                        />

                                        {/* Inline Edit Location */}
                                        <DynamicInput
                                            value={friend.location || friend.address || friend.city || ''}
                                            onChange={(e) => handleUpdate('address', e.target.value)}
                                            className="text-sm text-text-secondary lowercase"
                                            placeholder="add location..."
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* Removed separate Edit Button as inline editing handles it! */}

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
                                        {/* Details Section - Editable */}
                                        <div className="space-y-4">
                                            <DetailRow label="birthday" value={friend.birthday} onChange={(val) => handleUpdate('birthday', val)} />
                                            <DetailRow label="anniversary" value={friend.anniversary} onChange={(val) => handleUpdate('anniversary', val)} />
                                            <DetailRow label="phone" value={friend.phone} onChange={(val) => handleUpdate('phone', val)} />
                                            <DetailRow label="address" value={friend.address} onChange={(val) => handleUpdate('address', val)} />
                                            <DetailRow label="partner" value={friend.partner} onChange={(val) => handleUpdate('partner', val)} />
                                        </div>

                                        {/* Notes Section - Editable */}
                                        <div className="p-4 bg-gray-50 rounded-xl space-y-2 group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                                            <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider">notes</h3>
                                            <textarea
                                                value={friend.notes || ''}
                                                onChange={(e) => handleUpdate('notes', e.target.value)}
                                                placeholder="add notes..."
                                                className="w-full bg-transparent border-none focus:outline-none text-text-primary whitespace-pre-wrap resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Photo Cluster */}
                                    {(friend.photos?.length > 0 || friend.photo) && (
                                        <div className="pt-4">
                                            <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider mb-4">photos</h3>
                                            <div className="flex -space-x-4 overflow-x-auto pb-4 pl-2 scrolbar-hide">
                                                {(friend.photos || [friend.photo]).map((photo, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md flex-shrink-0 hover:scale-110 hover:z-10 transition-transform duration-300 overflow-hidden"
                                                    >
                                                        <img src={photo} alt="memory" className="w-full h-full object-cover" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Audit Trail / Gantt View
                                <div className="space-y-6">
                                    <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider mb-4">interaction history</h3>
                                    <div className="space-y-0">
                                        {[
                                            { date: 'Today', event: 'Viewed profile', Icon: Icons.Eye },
                                            { date: '2 weeks ago', event: 'Sent a gift', Icon: Icons.Gift },
                                            { date: '1 month ago', event: 'Met for coffee', Icon: Icons.Coffee },
                                            { date: '3 months ago', event: 'Added to Human.', Icon: Icons.Sparkles },
                                        ].map((item, i, arr) => (
                                            <div key={i} className="flex gap-4">
                                                {/* Stepper Column */}
                                                <div className="flex flex-col items-center">
                                                    <div className="relative z-10 bg-white p-1">
                                                        <item.Icon className="w-5 h-5 text-brand" />
                                                    </div>
                                                    {/* Line connects to next item */}
                                                    {i !== arr.length - 1 && (
                                                        <div className="w-px flex-1 bg-gray-200 my-1" />
                                                    )}
                                                </div>
                                                {/* Content Column */}
                                                <div className="pb-8 pt-1.5">
                                                    <p className="text-xs text-text-secondary mb-1 lowercase tracking-wide">{item.date}</p>
                                                    <p className="font-medium text-text-primary leading-tight lowercase">{item.event}</p>
                                                </div>
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

function DetailRow({ label, value, onChange }) {
    return (
        <div className="grid grid-cols-3 gap-4 pb-3 last:border-0 text-sm items-center">
            <span className="text-text-secondary font-medium lowercase">{label}</span>
            <div className="col-span-2">
                <DynamicInput
                    value={value || ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    placeholder="add info..."
                    className="w-full text-text-primary"
                />
            </div>
        </div>
    );
}
