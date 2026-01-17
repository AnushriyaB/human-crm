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
                        className="absolute top-full right-0 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 w-80"
                    >
                        <div className="p-4">
                            {step === 'name' ? (
                                <form onSubmit={handleNameSubmit} className="space-y-3">
                                    <Input
                                        placeholder="friend's name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                        className="text-center bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl text-lg font-medium"
                                    />
                                    <Button type="submit" className="w-full rounded-xl lowercase shadow-sm h-10 text-sm">
                                        generate invite
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-4 text-center">
                                    <div
                                        className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 cursor-copy active:scale-95 transition-transform group hover:border-brand/30"
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
                                                onComplete({ name, passphrase });
                                                reset();
                                            }}
                                            className="w-full rounded-xl py-2 h-auto text-sm lowercase"
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
