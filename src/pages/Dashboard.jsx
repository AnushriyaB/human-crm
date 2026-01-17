import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useFriends } from '../context/FriendContext';
import AddFriend from '../components/AddFriend';
import SideSheet from '../components/ui/SideSheet';
import SettingsModal from '../components/SettingsModal';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { friends, addFriend } = useFriends();
    const [isAdding, setIsAdding] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const navigate = useNavigate();

    const handleFriendAdded = (friendData) => {
        navigate('/friend-form', { state: { ...friendData } });
    };

    if (isAdding) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50/50">
                <AddFriend
                    onCancel={() => setIsAdding(false)}
                    onComplete={handleFriendAdded}
                />
            </div>
        );
    }

    if (friends.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-medium text-text-primary">
                        your world is empty.<br />start with one.
                    </h2>
                    <Button
                        onClick={() => setIsAdding(true)}
                        size="lg"
                        className="rounded-full px-8 shadow-lg shadow-brand/20 lowercase"
                    >
                        add a friend
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="relative w-full h-screen overflow-hidden bg-[#F8F9FA]">
                {/* Settings Toggle */}
                <button
                    onClick={() => setSettingsOpen(true)}
                    className="absolute top-6 right-6 z-30 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
                >
                    Settings
                </button>

                {/* Timeline Ribbon (Top) */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-full max-w-sm h-[1px] bg-gray-200 relative flex justify-between items-center px-8 pointer-events-auto">
                        {/* Simulated timeline dots */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-brand cursor-pointer transition-colors" />
                        ))}
                    </div>
                </div>

                {/* Map Background */}
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-20 opacity-80 pointer-events-none">
                    <img
                        src="/src/assets/world-map.png"
                        alt="world map"
                        className="w-full max-w-6xl object-contain opacity-20"
                    />
                </div>

                {/* User Center Dot */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="relative group cursor-pointer" onClick={() => setSelectedFriend({
                        id: 'me',
                        name: 'Me',
                        address: 'My Coordinates',
                        notes: 'This is my world.',
                        photo: null
                    })}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-brand rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] relative z-10"
                        >
                            <div className="absolute inset-0 bg-brand rounded-full animate-ping opacity-20" />
                        </motion.div>
                        {/* Hover Tooltip for Me */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
                            my profile
                        </div>
                    </div>
                </div>

                {/* Friend Cards Layer (Map) */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {friends.filter(f => f.x !== null).map((f) => (
                        <motion.div
                            key={f.id}
                            layoutId={`card-${f.id}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute group cursor-pointer pointer-events-auto"
                            style={{ left: `${f.x}%`, top: `${f.y}%` }}
                            onClick={() => setSelectedFriend(f)}
                        >
                            <div className="relative bg-white pl-8 pr-8 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2">
                                {/* Photo overlapping left edge */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                    {f.photo ? (
                                        <img src={f.photo} alt={f.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                            {f.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="font-medium text-sm text-text-primary whitespace-nowrap lowercase">{f.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* The Shelf (Bottom) */}
                {friends.some(f => f.x === null) && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100/80 to-transparent z-20 flex items-end justify-center pb-8 pointer-events-none">
                        <div className="flex gap-4 px-8 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm pointer-events-auto">
                            {friends.filter(f => f.x === null).map((f) => (
                                <motion.div
                                    key={f.id}
                                    layoutId={`card-${f.id}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={() => setSelectedFriend(f)}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                            {f.photo ? (
                                                <img src={f.photo} alt={f.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {f.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-text-secondary lowercase">{f.name}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Floating Add Button */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                    <Button onClick={() => setIsAdding(true)} className="rounded-full shadow-xl bg-white text-black hover:bg-gray-50 border border-gray-100 lowercase">
                        add friend
                    </Button>
                </div>
            </div>

            <SideSheet
                isOpen={!!selectedFriend}
                onClose={() => setSelectedFriend(null)}
                friend={selectedFriend}
            />

            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
}
