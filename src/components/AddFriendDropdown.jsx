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
            // Quick Add: Add friend immediately to shelf
            onComplete({ name, passphrase: code, navigate: false, shouldClose: false });
        }
    };

    const reset = () => {
        setStep('name');
        setName('');
        setPassphrase('');
        setCopied(false);
        onClose();
    };

    const handleCopyPasskey = () => {
        navigator.clipboard.writeText(passphrase);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                        className="absolute top-full left-0 mt-2 rounded-[2px] shadow-xl overflow-hidden z-50 w-80 pointer-events-auto"
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            borderColor: 'var(--color-border)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: 'var(--color-text-primary)'
                        }}
                    >
                        <div className="p-4">
                            {step === 'name' ? (
                                <form onSubmit={handleNameSubmit} className="space-y-3">
                                    <Input
                                        placeholder="friend's name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                        className="border-transparent transition-all rounded-[2px] text-lg font-medium shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]"
                                        style={{
                                            backgroundColor: 'var(--color-button-bg)',
                                            color: 'var(--color-text-primary)'
                                        }}
                                    />
                                    <Button type="submit" className="w-full rounded-[2px] lowercase shadow-sm h-10 text-sm">
                                        generate invite
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-4 text-center">
                                    <div
                                        className={`p-3 bg-gray-50 rounded-[2px] border border-dashed transition-all ${copied ? 'border-green-500 bg-green-50' : 'border-gray-200 cursor-copy active:scale-95 hover:border-brand/30'} group`}
                                        onClick={handleCopyPasskey}
                                    >
                                        <p className="text-xs text-text-secondary mb-1 lowercase">
                                            {copied ? 'copied!' : 'click to copy key'}
                                        </p>
                                        <div className="flex items-center justify-center gap-2">
                                            <p className={`text-lg font-mono tracking-wider ${copied ? 'text-green-600' : 'text-brand group-hover:line-through decoration-brand'}`}>{passphrase}</p>
                                            <Icons.Copy className={`w-4 h-4 transition-all ${copied ? 'text-green-500' : 'text-gray-300 group-hover:text-brand group-hover:scale-110'}`} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => {
                                                onComplete({ name, passphrase, navigate: true, isEdit: true });
                                                reset();
                                            }}
                                            className="w-full rounded-[2px] py-2 h-auto text-sm lowercase"
                                        >
                                            fill it out myself
                                        </Button>
                                        <button
                                            onClick={reset}
                                            className="text-xs hover:opacity-80 transition-colors lowercase"
                                            style={{ color: 'var(--color-text-secondary)' }}
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
