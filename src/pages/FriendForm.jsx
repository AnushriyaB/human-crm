import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useFriends } from '../context/FriendContext';

const STEPS = [
    { id: 'welcome', title: '' },
    { id: 'basics', title: 'basics' },
    { id: 'contact', title: 'stay close' },
    { id: 'location', title: 'coordinates' },
    { id: 'notes', title: 'extra love' }
];

export default function FriendForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addFriend } = useFriends();

    const initialName = state?.name || 'friend';
    const passphrase = state?.passphrase || '';

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: initialName,
        birthday: '',
        anniversary: '',
        partner: '',
        children: '',
        phone: '',
        address: '',
        notes: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const next = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
        else handleSubmit();
    };

    const back = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const handleSubmit = () => {
        addFriend({ ...formData, passphrase });
        navigate('/dashboard');
    };

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 md:p-12 max-w-xl mx-auto lowercase">
            <div className="w-full absolute top-6 left-0 px-6 flex justify-between items-center text-sm text-text-secondary">
                <span>{passphrase}</span>
                <span>{currentStep + 1} / {STEPS.length}</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full space-y-8"
                >
                    {currentStep === 0 && (
                        <div className="text-center space-y-4 py-10">
                            <h1 className="text-4xl font-bold text-text-primary">hello, {initialName}.</h1>
                            <p className="text-xl text-text-secondary">ready to join the world?</p>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">first, some dates.</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">birthday</label>
                                    <Input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">anniversary</label>
                                    <Input name="anniversary" type="date" value={formData.anniversary} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">who are your people?</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">partner</label>
                                    <Input name="partner" value={formData.partner} onChange={handleChange} placeholder="name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">phone</label>
                                    <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="digits" />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">where are you?</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">address</label>
                                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="full address" />

                                    {formData.address && formData.address.length > 5 && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-brand text-sm italic"
                                        >
                                            "i can order something nice for you if you put your full address"
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">anything else?</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="flex w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 min-h-[150px]"
                                        placeholder="what makes you, you?"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        {currentStep > 0 && (
                            <Button variant="ghost" onClick={back} className="flex-1">
                                back
                            </Button>
                        )}
                        <Button onClick={next} className="flex-1">
                            {currentStep === STEPS.length - 1 ? 'finish' : 'next'}
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
