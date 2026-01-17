import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';
import { useFriends } from '../context/FriendContext';
import AddFriendDropdown from '../components/AddFriendDropdown';
import AddFriend from '../components/AddFriend';
import SideSheet from '../components/ui/SideSheet';
import SettingsDropdown from '../components/SettingsDropdown';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { friends, addFriend } = useFriends();
    const [isAdding, setIsAdding] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const navigate = useNavigate();

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

    // Fix: Keep empty state view active if we are currently onboarding, even if a friend was added (Quick Add)
    if (friends.length === 0 || isOnboarding) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-center transition-all duration-500">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="max-w-md w-full space-y-8"
                    layout
                >
                    <motion.div layout className="relative z-10">
                        <Button
                            onClick={() => setIsOnboarding(true)}
                            size="lg"
                            disabled={isOnboarding}
                            className={`px-8 py-4 text-lg rounded-[2px] lowercase bg-gray-50 border border-gray-100 shadow-inner text-text-secondary transition-all ${isOnboarding ? 'opacity-50 cursor-default' : 'hover:bg-blue-50/20 hover:text-text-primary'}`}
                        >
                            add your first friend
                        </Button>
                    </motion.div>

                    <AnimatePresence>
                        {isOnboarding && (
                            <motion.div
                                key="onboarding"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                onLayoutAnimationComplete={() => {
                                    // Smooth scroll to ensure visibility
                                    const element = document.getElementById('onboarding-card');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }}
                                className="w-full"
                                id="onboarding-card"
                            >
                                <AddFriend
                                    onCancel={() => setIsOnboarding(false)}
                                    onComplete={handleFriendAdded}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }


    return (
        <>
            <div className="relative w-full h-screen overflow-hidden bg-white">
                {/* Top Navigation */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30 pointer-events-none">
                    {/* Settings Button (Left) */}
                    <div className="relative pointer-events-auto">
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`rounded-[2px] p-3 transition-all duration-300 ${settingsOpen
                                ? 'bg-blue-50/30 text-brand shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] border border-blue-100/30 px-6'
                                : 'bg-gray-50 border border-gray-100 shadow-inner text-text-secondary hover:bg-blue-50/20 hover:text-text-primary'
                                }`}
                        >
                            {settingsOpen ? <span className="text-sm font-medium lowercase">close</span> : <Icons.Settings className="w-6 h-6" />}
                        </button>
                        <SettingsDropdown isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
                    </div>

                    {/* Middle Title */}
                    <h1 className="text-sm font-medium text-text-primary lowercase tracking-wide pointer-events-auto">book of humans</h1>

                    {/* Add Friend Button (Right) */}
                    <div className="relative pointer-events-auto">
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className={`rounded-[2px] p-3 transition-all duration-300 ${isAdding
                                ? 'bg-blue-50/30 text-brand shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] border border-blue-100/30 px-6' // wider for "close" text
                                : 'bg-gray-50 border border-gray-100 shadow-inner text-text-primary hover:bg-blue-50/20'
                                }`}
                        >
                            {isAdding ? <span className="text-sm font-medium lowercase">close</span> : <Icons.UserPlus className="w-6 h-6" />}
                        </button>
                        <AddFriendDropdown
                            isOpen={isAdding}
                            onClose={() => setIsAdding(false)}
                            onComplete={handleFriendAdded}
                        />
                    </div>
                </div>

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



                {/* The Shelf (Left Side) */}
                {friends.some(f => f.x === null) && (
                    <div className="absolute top-32 left-8 w-fit z-20 flex flex-col gap-4 pointer-events-none">
                        <h3 className="text-xs font-medium text-text-gray pl-1 lowercase tracking-wide opacity-50">add location</h3>
                        <div className="flex flex-col gap-3 pointer-events-auto">
                            {friends.filter(f => f.x === null).map((f) => (
                                <motion.div
                                    key={f.id}
                                    layoutId={`card-${f.id}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => setSelectedFriend(f)}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-white transition-all w-full">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-white shadow-inner overflow-hidden flex-shrink-0">
                                            {(f.photos?.[0] || f.photo) ? (
                                                <img src={f.photos?.[0] || f.photo} alt={f.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                    {f.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary lowercase truncate">{f.name}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <SideSheet
                isOpen={!!selectedFriend}
                onClose={() => setSelectedFriend(null)}
                friend={selectedFriend}
            />


        </>
    );
}
