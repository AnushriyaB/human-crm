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
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F8F9FA] text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="space-y-8 bg-white/80 backdrop-blur-sm p-16 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-white/60"
                >
                    <h2 className="text-3xl font-medium text-text-primary leading-tight">
                        your world is empty.<br />start with one.
                    </h2>
                    <Button
                        onClick={() => setIsAdding(true)}
                        size="lg"
                        className="rounded-full px-10 py-6 text-lg shadow-xl shadow-brand/10 hover:shadow-brand/20 transition-all lowercase"
                    >
                        add a friend
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="relative w-full h-screen overflow-hidden bg-white">
                {/* Settings Toggle */}
                <button
                    onClick={() => setSettingsOpen(true)}
                    className="absolute top-6 right-6 z-30 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
                >
                    Settings
                </button>

                {/* Map Background */}
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-20 opacity-100 pointer-events-none">
                    <img
                        src="/src/assets/world-map.png"
                        alt="world map"
                        className="w-full max-w-6xl object-contain opacity-100" // Increased opacity as per request for "white bg" cleaning
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
                            className="w-3 h-3 bg-brand rounded-full shadow-sm relative z-10"
                        >
                        </motion.div>
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
                                    {(f.photos?.[0] || f.photo) ? (
                                        <img src={f.photos?.[0] || f.photo} alt={f.name} className="w-full h-full object-cover" />
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
                                            {(f.photos?.[0] || f.photo) ? (
                                                <img src={f.photos?.[0] || f.photo} alt={f.name} className="w-full h-full object-cover" />
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
