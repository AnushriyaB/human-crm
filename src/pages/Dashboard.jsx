import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';
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
                        <button
                            onClick={() => setSettingsOpen(true)}
                            className="pointer-events-auto text-text-secondary hover:text-text-primary transition-colors p-2 rounded-full hover:bg-gray-50"
                        >
                            <Icons.Settings className="w-6 h-6" />
                        </button>

                        <Button onClick={() => setIsAdding(true)} className="pointer-events-auto rounded-full shadow-lg bg-white text-black hover:bg-gray-50 border border-gray-100 lowercase px-6">
                            add friend
                        </Button>
                    </div>
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
