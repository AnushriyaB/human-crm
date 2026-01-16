import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
    const [step, setStep] = useState('email'); // email | otp
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setStep('otp');
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp) {
            // Simulate auth success
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-text-primary"
                    >
                        Human.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-text-secondary text-lg"
                    >
                        A minimal world for your friends.
                    </motion.p>
                </div>

                <div className="mt-12">
                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.form
                                key="email-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleEmailSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Email or Phone"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                    <p className="text-sm text-text-secondary pl-1">
                                        We'll send you a code. No passwords.
                                    </p>
                                </div>
                                <Button type="submit" className="w-full" size="lg">
                                    Continue
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleOtpSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Code (Try 1234)"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="text-sm text-text-secondary hover:text-brand pl-1 transition-colors"
                                    >
                                        Wrong number? Go back.
                                    </button>
                                </div>
                                <Button type="submit" className="w-full" size="lg">
                                    Enter World
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
