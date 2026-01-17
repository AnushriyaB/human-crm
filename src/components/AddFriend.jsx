import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const WORDS = ['sun', 'moon', 'river', 'sky', 'star', 'tree', 'flower', 'ocean', 'mountain', 'cloud'];

export default function AddFriend({ onCancel, onComplete }) {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] w-full border border-gray-50"
            >
                <h2 className="text-2xl font-bold mb-8 text-text-primary text-center">
                    {step === 'name' ? 'add a friend' : 'share this'}
                </h2>

                {step === 'name' ? (
                    <form onSubmit={handleNameSubmit} className="w-full space-y-6">
                        <Input
                            placeholder="friend's name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            className="text-center text-xl bg-gray-50 border-transparent focus:bg-white transition-all h-14 rounded-2xl"
                        />
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 rounded-xl lowercase">
                                cancel
                            </Button>
                            <Button type="submit" className="flex-1 rounded-xl lowercase shadow-lg shadow-brand/20">
                                next
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="w-full space-y-8 text-center">
                        <div
                            className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 cursor-copy active:scale-95 transition-transform"
                            onClick={() => {
                                navigator.clipboard.writeText(passphrase);
                                // Optional toast could go here
                            }}
                        >
                            <p className="text-sm text-text-secondary mb-3">their unique key (click to copy)</p>
                            <p className="text-3xl font-mono text-brand select-all tracking-wider break-all">{passphrase}</p>
                        </div>
                        <p className="text-text-secondary text-sm px-4 leading-relaxed">
                            share this with <b className="text-text-primary">{name}</b> so they can join your world.
                        </p>
                        <div className="flex gap-3 flex-col pt-2">
                            <Button onClick={() => onComplete({ name, passphrase })} className="w-full rounded-xl py-6 lowercase shadow-lg shadow-brand/20">
                                simulate friend filling form
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onCancel}
                                className="lowercase border border-gray-200 rounded-xl hover:bg-gray-50 bg-white"
                            >
                                close
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
