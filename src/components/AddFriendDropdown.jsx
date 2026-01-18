import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Icons } from './ui/Icons';

const WORDS = ['sun', 'moon', 'river', 'sky', 'star', 'tree', 'flower', 'ocean', 'mountain', 'cloud'];

export default function AddFriendDropdown({ isOpen, onClose, onComplete }) {
    const [step, setStep] = useState('name'); // name | share
    const [name, setName] = useState('');
    const [passphrase, setPassphrase] = useState('');

    const generatePassphrase = () => {
        const w1 = WORDS[Math.floor(Math.random() * WORDS.length)];
        const w2 = WORDS[Math.floor(Math.random() * WORDS.length)];
        const w3 = WORDS[Math.floor(Math.random() * WORDS.length)];
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        return `${w1}${n1}${w2}${n2}${w3}`;
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (name) {
            const code = generatePassphrase();
            setPassphrase(code);
            setStep('share');
            // Quick Add: Add friend immediately to shelf
            onComplete({ name, passphrase: code, navigate: false });
        }
    };

    const reset = () => {
        setStep('name');
        setName('');
        setPassphrase('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible backdrop to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={reset} />

                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="absolute top-full right-0 mt-2 bg-white rounded-[2px] shadow-xl border border-gray-100 overflow-hidden z-50 w-80 pointer-events-auto"
                    >
                        <div className="p-4">
                            {step === 'name' ? (
                                <form onSubmit={handleNameSubmit} className="space-y-3">
                                    <Input
                                        placeholder="friend's name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                        className="text-center bg-gray-50 border-transparent focus:bg-white transition-all rounded-[2px] text-lg font-medium"
                                    />
                                    <Button type="submit" className="w-full rounded-[2px] lowercase shadow-sm h-10 text-sm">
                                        generate invite
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-4 text-center">
                                    <div
                                        className="p-3 bg-gray-50 rounded-[2px] border border-dashed border-gray-200 cursor-copy active:scale-95 transition-transform group hover:border-brand/30"
                                        onClick={() => {
                                            navigator.clipboard.writeText(passphrase);
                                            setTimeout(reset, 200);
                                        }}
                                    >
                                        <p className="text-xs text-text-secondary mb-1 lowercase">click to copy key</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <p className="text-lg font-mono text-brand tracking-wider group-hover:line-through decoration-brand">{passphrase}</p>
                                            <Icons.Link className="w-3 h-3 text-gray-300 group-hover:text-brand transition-colors" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => {
                                                // Navigate to edit form for the *already added* friend
                                                // We need to pass the ID or logic to find it? 
                                                // Actually Dashboard `addFriend` creates a new ID. 
                                                // `addFriendContext` usually returns the new friend or ID.
                                                // Since we already called "Quick Add" (onComplete false), the friend EXISTS.
                                                // We should probably just navigate to it? 
                                                // BUT, `addFriend` in context might create DUPLICATE if we call it again?
                                                // A simple solution: The Dashboard `addFriend` logic I wrote handles "navigate: false" by calling `addFriend`.
                                                // If I call it AGAIN here with "navigate: true", it might add a SECOND friend.
                                                // 
                                                // Better approach:
                                                // 1. `handleNameSubmit` calls `onComplete({ ... navigate: false })`.
                                                // 2. Dashboard adds it.
                                                // 3. If user clicks "Fill it out", we need to EDIT that friend.
                                                // 
                                                // Since we don't have the ID back easily here without refactoring context...
                                                // Maybe "Quick Add" shouldn't add it yet?
                                                // But user asked: "when I add friends whos forms i don't fill myself, show them under add location".
                                                // This implies the ACT of generating invite ADDS them.
                                                // So yes, they must be added then.
                                                // 
                                                // If I click "Fill it out", I should edit the MOST RECENTLY ADDED friend?
                                                // Or pass the data to `FriendForm` with `isEdit: true` and match by name/passphrase?
                                                // 
                                                // Let's change the strategy for "fill it out":
                                                // Pass `navigate: true, isEdit: true`.
                                                // Dashboard `handleFriendAdded`:
                                                // if (navigate) { 
                                                //    if (isEdit) { navigate('/friend-form', { state: { ... find friend by passphrase ... } }) }
                                                // }
                                                //
                                                // Safe bet: Just navigate with the data passed. `FriendForm` uses `addFriend` (creates new) or `updateFriend` (edits).
                                                // If we navigate with just data (no ID), `FriendForm` thinks it's new and `handleSubmit` calls `addFriend`.
                                                // This would create a DUPLICATE.
                                                //
                                                // Solution:
                                                // Don't modify `FriendForm` logic yet.
                                                // In `handleNameSubmit`, call `onComplete(..., navigate: false)`. This adds to shelf.
                                                // In "fill out", call `onComplete(..., navigate: true, isUpdate: true)`.
                                                // Dashboard needs to handle `isUpdate`.
                                                // `useFriends` needs to return the added friend ID?
                                                //
                                                // Alternative: Just navigate to `friend-form` with the data. `FriendForm` has `handleSubmit` which calls `addFriend`.
                                                // If we ALREADY added it via Quick Add, we need to pass the ID to `FriendForm`.
                                                //
                                                // Complex. Let's stick to the User Request: "when I add friends ... show them".
                                                // If I click "Fill it out myself", I am filling it out myself. So they DON'T go to shelf initially? They go to map when I finish?
                                                // Correct.
                                                // 
                                                // So:
                                                // 1. "Generate Invite" (viewing code) -> Adds to Shelf immediately. CORRECT.
                                                // 2. "Fill it out myself" -> Does NOT add to shelf. Goes to Form. User fills form. Adds to Map. CORRECT.
                                                //
                                                // Problem: If I "Generate Invite" (Added to Shelf), AND THEN decide "Actually I'll fill it out" (Click button)...
                                                // I am now editing the shelf item.
                                                // So "Fill it out" must be an EDIT operation on the shelf item.
                                                //
                                                // Can I assume the last added friend is the one? Or search by passphrase?
                                                // Let's search by passphrase in Dashboard.

                                                onComplete({ name, passphrase, navigate: true, isEdit: true });
                                                reset();
                                            }}
                                            className="w-full rounded-[2px] py-2 h-auto text-sm lowercase"
                                        >
                                            fill it out myself
                                        </Button>
                                        <button
                                            onClick={reset}
                                            className="text-xs text-text-secondary hover:text-text-primary transition-colors lowercase"
                                        >
                                            done, close this
                                        </button>
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
