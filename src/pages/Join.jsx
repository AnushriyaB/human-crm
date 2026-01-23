import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../context/FriendContext';
import { Button } from '../components/ui/Button';

export default function Join() {
    const [passkey, setPasskey] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { friends } = useFriends();

    const handleJoin = (e) => {
        e.preventDefault();
        const cleanKey = passkey.trim();

        // Find friend by matching passphrase
        // In a real app, this would query the backend
        const friend = friends.find(f => f.passphrase === cleanKey);

        if (friend) {
            navigate('/friend-form', { state: { ...friend, isGuest: true, isEdit: true } });
        } else {
            // Demo Mode: Allow any key to "join" as a new user
            navigate('/friend-form', { state: { passphrase: cleanKey, isGuest: true, isEdit: false, name: '' } });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-text-primary lowercase">join the circle</h1>
                    <p className="text-text-secondary lowercase">enter the magic words shared with you.</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={passkey}
                            onChange={(e) => {
                                setPasskey(e.target.value);
                                setError('');
                            }}
                            placeholder="sun5moon9river"
                            className="w-full text-center text-3xl font-mono font-medium bg-transparent border-b-2 border-gray-100 focus:border-brand outline-none pb-2 placeholder:text-gray-200 text-brand transition-colors lowercase"
                            autoFocus
                        />
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-0 right-0 -bottom-8 text-sm text-red-400 lowercase font-medium"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={!passkey}
                            className="rounded-[8px] px-10 py-3 bg-brand text-white shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all lowercase disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            enter
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
