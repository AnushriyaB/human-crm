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
                        Your world is empty.<br />Start with one.
                    </h2>
                    <Button
                        onClick={() => setIsAdding(true)}
                        size="lg"
                        className="rounded-full px-8 shadow-lg shadow-brand/20"
                    >
                        Add a friend
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

                {/* Map Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* User Center Dot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 bg-brand rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] z-10 relative"
                    >
                        <div className="absolute inset-0 bg-brand rounded-full animate-ping opacity-20" />
                    </motion.div>
                </div>

                {/* Friend Cards Layer */}
                <div className="absolute inset-0">
                    {friends.map((f, i) => {
                        // Deterministic random position based on ID or index for stability across renders (demo only)
                        // In reality, would be lat/long. Using Math.sin for pseudo-randomness.
                        const angle = (i / friends.length) * 2 * Math.PI;
                        const radius = 30; // % distance from center
                        const x = 50 + radius * Math.cos(angle + i);
                        const y = 50 + radius * Math.sin(angle + i);

                        return (
                            <motion.div
                                key={f.id}
                                layoutId={`card-${f.id}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                className="absolute group cursor-pointer"
                                style={{ left: `${x}%`, top: `${y}%` }}
                                onClick={() => setSelectedFriend(f)}
                            >
                                <div className="relative bg-white pl-8 pr-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2">
                                    {/* Photo overlapping left edge */}
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                        {/* Initials fallback */}
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                            {f.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    </div>
                                    <span className="font-medium text-sm text-text-primary whitespace-nowrap">{f.name}</span>

                                    {/* Hover Arrow */}
                                    <div className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                                        <span className="text-brand">→</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Floating Add Button */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                    <Button onClick={() => setIsAdding(true)} className="rounded-full shadow-xl bg-white text-black hover:bg-gray-50 border border-gray-100">
                        Add Friend
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
