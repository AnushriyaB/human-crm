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
        navigate('/friend-form', { state: { ...friendData } });
    };

    if (isOnboarding) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50/50">
                <AddFriend
                    onCancel={() => setIsOnboarding(false)}
                    onComplete={handleFriendAdded}
                />
            </div>
        );
    }



    return (
        <>
            <div className="relative w-full h-screen overflow-hidden bg-white">
                {/* Top Navigation */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30 pointer-events-none">
                    {/* Left side empty for now, or branding? User said "Add a top nav and keep two button". 
                         "Keep the settings button as an icon." 
                         "Add friend button goes to the top right."
                         If I put Settings on the left, it separates them nicely. 
                         Let's put Settings on the left for balance?
                         "Keep the settings button as an icon" (it was top right).
                         "Add friend button goes to the top right".
                         This implies Add Friend is taking the Top Right spot.
                         Maybe Settings should stay Top Right? 
                         If so: <div className="flex gap-4 pointer-events-auto ml-auto">
                     */}

                    <div className="flex w-full justify-between items-center">
                        {/* Settings Button (Left or Right? Let's assume Left for balance if Add Friend is Right, or maybe grouped?) 
                            The user said "Add friend button goes to the top right". 
                            And "Keep the settings button as an icon".
                            "Top nav... keep two button".
                            I will group them in the top right for "App Controls" pattern, or split them?
                            Let's split them. Settings Left, Add Friend Right. It feels like a standard nav.
                            Wait, the previous setting was Top Right.
                            Let's try putting Settings on the LEFT and Add Friend on the RIGHT.
                        */}
                        <div className="relative">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className={`pointer-events-auto text-text-secondary hover:text-text-primary transition-colors p-2 rounded-full hover:bg-gray-50 ${settingsOpen ? 'bg-gray-50 text-text-primary' : ''}`}
                            >
                                <Icons.Settings className="w-6 h-6" />
                            </button>
                            <SettingsDropdown isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
                        </div>

                        <div className="relative">
                            <Button
                                onClick={() => setIsAdding(!isAdding)}
                                className={`pointer-events-auto rounded-full shadow-lg border border-gray-100 lowercase px-6 transition-all ${isAdding ? 'bg-gray-50 text-text-primary shadow-inner' : 'bg-white text-black hover:bg-gray-50'}`}
                            >
                                {isAdding ? 'close' : 'add friend'}
                            </Button>
                            <AddFriendDropdown
                                isOpen={isAdding}
                                onClose={() => setIsAdding(false)}
                                onComplete={handleFriendAdded}
                            />
                        </div>
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
            </div>

            <SideSheet
                isOpen={!!selectedFriend}
                onClose={() => setSelectedFriend(null)}
                friend={selectedFriend}
            />


        </>
    );
}
