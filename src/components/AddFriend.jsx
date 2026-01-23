import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Icons } from './ui/Icons';

const WORDS = ['sun', 'moon', 'river', 'sky', 'star', 'tree', 'flower', 'ocean', 'mountain', 'cloud'];

export default function AddFriend({ onCancel, onComplete }) {
    const [step, setStep] = useState('name'); // name | share
    const [name, setName] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [copied, setCopied] = useState(false);

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
            // Auto-save friend (Quick Add)
            onComplete({ name, passphrase: code, navigate: false });
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(passphrase);
        setCopied(true);
        setTimeout(() => {
            onCancel(); // Close modal/go to dashboard
        }, 800);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <AnimatePresence mode="wait">
                    {step === 'name' ? (
                        <motion.form
                            key="name"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            onSubmit={handleNameSubmit}
                            className="w-full flex flex-col items-center space-y-8"
                        >
                            <div className="relative w-full max-w-xs">
                                <input
                                    placeholder="Friend's name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                    className="w-full text-center text-3xl font-medium bg-transparent border-none outline-none placeholder:text-gray-200 text-text-primary caret-brand caret-[4px]"
                                    style={{ caretColor: '#3B82F6' }} // Ensure brand color
                                />
                                {name === '' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 pointer-events-none flex items-center justify-center"
                                    >
                                        {/* Optional: Blinking cursor visual if native isn't thick enough, 
                                            but native caret-brand is usually good. 
                                            User asked for "Friend's name" placeholder. */}
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onCancel}
                                    className="rounded-[8px] px-6 py-3 text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors lowercase"
                                >
                                    cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!name}
                                    className="rounded-[8px] px-10 py-3 bg-brand text-white shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all lowercase disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    next
                                </Button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="share"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex flex-col items-center space-y-8 text-center"
                        >
                            <div className="space-y-2">
                                <p className="text-text-secondary text-sm lowercase">invite code for <span className="font-semibold text-text-primary">{name}</span></p>
                                <div
                                    className="text-4xl font-mono text-brand font-medium tracking-tight cursor-pointer selection:bg-blue-100"
                                    onClick={handleCopy}
                                >
                                    {passphrase}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                <Button
                                    onClick={() => onComplete({ name, passphrase, navigate: true, isEdit: true })}
                                    className="w-full rounded-[8px] py-4 lowercase bg-white border border-gray-100 shadow-sm text-text-primary hover:bg-gray-50 transition-all"
                                >
                                    fill details manually
                                </Button>
                                <Button
                                    onClick={handleCopy}
                                    className={`w-full rounded-[8px] py-4 lowercase transition-all ${copied ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20' : 'bg-brand text-white shadow-brand/20'}`}
                                >
                                    {copied ? 'copied! sending you back...' : 'copy passkey'}
                                </Button>
                                <button
                                    onClick={onCancel}
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors lowercase pt-2"
                                >
                                    done, take me to dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
