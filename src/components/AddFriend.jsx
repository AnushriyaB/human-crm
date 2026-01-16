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
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-6 text-text-primary">
                {step === 'name' ? 'Add a friend' : 'Share this'}
            </h2>

            {step === 'name' ? (
                <form onSubmit={handleNameSubmit} className="w-full space-y-4">
                    <Input
                        placeholder="Friend's Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Next
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="w-full space-y-6 text-center">
                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-text-secondary mb-2">Their unique key</p>
                        <p className="text-2xl font-mono text-brand select-all">{passphrase}</p>
                    </div>
                    <p className="text-text-secondary">
                        Share this with <b>{name}</b> so they can join your world.
                    </p>
                    <div className="flex gap-2 flex-col">
                        <Button onClick={() => onComplete({ name, passphrase })} className="w-full">
                            Simulate Friend Filling Form
                        </Button>
                        <Button variant="ghost" onClick={onCancel}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
