import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';
import { useFriends } from '../context/FriendContext';
import AddFriendDropdown from '../components/AddFriendDropdown';
import SideSheet from '../components/ui/SideSheet';
import SettingsDropdown from '../components/SettingsDropdown';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import WorldMap from '../components/WorldMap';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const context = useFriends() || {};
    const friends = Array.isArray(context.friends) ? context.friends : [];
    const addFriend = context.addFriend || (() => { });

    const [isAdding, setIsAdding] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const navigate = useNavigate();

    // Derive selectedFriend from live friends array to avoid stale references
    const selectedFriend = selectedFriendId ? friends.find(f => f.id === selectedFriendId) : null;

    const handleFriendAdded = (friendData) => {
        // If it's a full add (clicked "fill it out myself"), navigate to form
        if (friendData.navigate) {
            // Check if we need to edit an existing friend (e.g. from Quick Add)
            if (friendData.isEdit) {
                const existing = friends.find(f => f.passphrase === friendData.passphrase);
                if (existing) {
                    navigate('/friend-form', { state: { ...existing, isEdit: true } });
                    return;
                }
            }
            navigate('/friend-form', { state: { ...friendData } });
        } else {
            // Just add to list (Quick Add / Invite)
            addFriend(friendData);
        }
    };

    const [showAbout, setShowAbout] = useState(() => !sessionStorage.getItem('hasSeenWelcomeCard'));

    useEffect(() => {
        if (showAbout) {
            const timer = setTimeout(() => {
                setShowAbout(false);
                sessionStorage.setItem('hasSeenWelcomeCard', 'true');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showAbout]);

    return (
        <div className="flex flex-col w-full h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>


            {/* Header */}
            <div className="relative z-30 flex items-center justify-between px-8 py-6 pointer-events-none">
                {/* Left: Add Human */}
                <div className="pointer-events-auto relative">
                    <button onClick={() => setIsAdding(!isAdding)} className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${isAdding ? 'shadow-active' : 'shadow-inner hover:shadow-sm'}`}
                        style={{
                            backgroundColor: 'var(--color-button-bg)',
                            borderColor: 'var(--color-border)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: isAdding ? 'var(--color-brand)' : 'var(--color-text-secondary)'
                        }}
                    >
                        <Icons.Plus className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    <AddFriendDropdown
                        isOpen={isAdding}
                        onClose={() => setIsAdding(false)}
                        onComplete={(data) => {
                            handleFriendAdded(data);
                            if (data.shouldClose !== false) {
                                setIsAdding(false);
                            }
                        }}
                    />
                </div>

                {/* Center: Title */}
                {/* Center: Title */}
                <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <h1 onClick={() => setShowAbout(!showAbout)} className="text-sm font-medium lowercase tracking-wide cursor-pointer hover:text-brand transition-colors select-none text-center" style={{ color: showAbout ? 'var(--color-brand)' : 'var(--color-text-primary)' }}>
                        book of humans
                    </h1>

                    <AnimatePresence>
                        {showAbout && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowAbout(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -6, height: 0, x: "-50%" }}
                                    animate={{ opacity: 1, y: 0, height: 'auto', x: "-50%" }}
                                    exit={{ opacity: 0, y: -6, height: 0, x: "-50%" }}
                                    className="absolute top-full mt-4 shadow-xl rounded-[8px] p-5 w-72 z-50 overflow-hidden flex flex-col items-start"
                                    style={{
                                        backgroundColor: 'var(--color-card-bg)',
                                        borderColor: 'var(--color-border)',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        left: '50%'
                                    }}
                                >
                                    <p className="text-xs leading-relaxed mb-3 text-left w-full" style={{ color: 'var(--color-text-secondary)' }}>
                                        a personal crm to help you stay close to the people who matter most.
                                    </p>
                                    <div className="flex items-center justify-start gap-1 w-full">
                                        <p className="text-xs leading-relaxed text-center" style={{ color: 'var(--color-text-secondary)' }}>
                                            made by
                                        </p>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-2 h-2 bg-brand rounded-full shadow-sm"
                                        >
                                        </motion.div>
                                        <a
                                            href="https://x.com/Anushriya_UX"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-medium text-brand hover:underline"
                                        >
                                            @Anushriya_UX
                                        </a>

                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Settings and Theme Toggle */}
                <div className="pointer-events-auto relative flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => setSettingsOpen(!settingsOpen)} className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${settingsOpen ? 'shadow-active' : 'shadow-inner hover:shadow-sm'}`}
                        style={{
                            backgroundColor: 'var(--color-button-bg)',
                            borderColor: 'var(--color-border)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: settingsOpen ? 'var(--color-brand)' : 'var(--color-text-secondary)'
                        }}
                    >
                        <Icons.Settings className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <SettingsDropdown
                        isOpen={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                    />
                </div>
            </div>

            {/* World Map Container */}
            <div className="flex-1 relative w-full overflow-hidden">
                <WorldMap
                    friends={friends}
                    onFriendClick={(f) => setSelectedFriendId(f.id)}
                />

                {/* Left: Friend Shelf (Only unmapped friends) */}
                <div className="absolute left-8 top-0 bottom-8 w-64 pointer-events-none flex flex-col justify-start pt-24">
                    <div className="pointer-events-auto space-y-3">
                        {friends.filter(f => !f.lat || !f.lon).length > 0 && (
                            <div className="mb-2">
                                <h3 className="text-xs font-medium pl-1 lowercase tracking-wide opacity-50" style={{ color: 'var(--color-text-secondary)' }}>add location</h3>
                            </div>
                        )}
                        {friends.filter(f => !f.lat || !f.lon).map((f) => (
                            <motion.div
                                key={f.id}
                                layoutId={`card-${f.id}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelectedFriendId(f.id)}
                                className="relative group cursor-pointer"
                            >
                                <div
                                    className="flex items-center gap-4 backdrop-blur-sm rounded-[8px] p-3 shadow-sm hover:shadow-md transition-all w-full"
                                    style={{
                                        backgroundColor: 'var(--color-card-bg)',
                                        borderColor: 'var(--color-border)',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        color: 'var(--color-text-primary)'
                                    }}
                                >
                                    <div className={`w-10 h-10 rounded-full shadow-inner overflow-hidden flex-shrink-0 border ${f.isMe ? 'bg-brand border-brand' : 'bg-gray-100 border-white'}`}>
                                        {(f.photos && f.photos.length > 0) || f.photo ? (
                                            <img src={f.photos?.[0] || f.photo} alt={f.name || 'Friend'} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold ${f.isMe ? 'text-white' : 'text-gray-400'}`}>
                                                {(f.name || '?').substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium lowercase truncate ${f.isMe ? 'text-brand' : 'text-text-secondary group-hover:text-text-primary'}`}>{f.name || 'friend'}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>



            <SideSheet
                isOpen={!!selectedFriend}
                onClose={() => setSelectedFriendId(null)}
                friend={selectedFriend}
            />


        </div>
    );
}
