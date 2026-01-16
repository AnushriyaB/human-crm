import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useFriends } from '../context/FriendContext';

export default function FriendForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addFriend } = useFriends();

    // State from the "Add Friend" flow
    const initialName = state?.name || '';
    const passphrase = state?.passphrase || '';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        addFriend({ ...formData, passphrase });
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white p-6 md:p-12 max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-8"
            >
                <div className="text-center space-y-2">
                    <p className="text-sm text-brand font-mono">{passphrase}</p>
                    <h1 className="text-3xl font-bold text-text-primary">Hello, {initialName || 'Friend'}.</h1>
                    <p className="text-text-secondary">Join the world.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Name</label>
                            <Input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Birthday</label>
                            <Input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Anniversary</label>
                            <Input name="anniversary" type="date" value={formData.anniversary} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Partner</label>
                            <Input name="partner" value={formData.partner} onChange={handleChange} placeholder="Optional" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-text-secondary">Address</label>
                            <Input name="address" value={formData.address} onChange={handleChange} placeholder="Full address" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Phone</label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} type="tel" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="flex w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                            placeholder="Anything else?"
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                        Save Details
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
