import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useFriends } from '../context/FriendContext';
import { Icons } from '../components/ui/Icons';
import { countries } from 'countries-list';

const STEPS = [
    { id: 'welcome', title: 'welcome', icon: null },
    { id: 'basics', title: 'basics', icon: Icons.Basics },
    { id: 'photo', title: 'face', icon: Icons.Face },
    { id: 'contact', title: 'contact', icon: Icons.Contact },
    { id: 'coordinates', title: 'coordinates', icon: Icons.Coordinates },
    { id: 'vibe', title: 'vibe', icon: Icons.Vibe },
    { id: 'extra', title: 'extra love', icon: Icons.ExtraLove }
];

export default function FriendForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addFriend, updateFriend } = useFriends();

    const initialName = state?.name || 'friend';
    const passphrase = state?.passphrase || '';
    const isEdit = state?.isEdit || false;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [locationType, setLocationType] = useState(state?.address ? 'address' : 'city'); // Default logic based on existing data

    const [formData, setFormData] = useState({
        name: initialName,
        photo: state?.photo || null,
        birthday: state?.birthday || '',
        anniversary: state?.anniversary || '',
        partner: state?.partner || '',
        phone: state?.phone || '',
        email: state?.email || '',
        address: state?.address || '',
        city: state?.city || '',
        memory: state?.memory || '',
        how_we_met: state?.how_we_met || '',
        notes: state?.notes || '',
        gift_ideas: state?.gift_ideas || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const next = () => {
        if (currentStepIndex < STEPS.length - 1) setCurrentStepIndex(c => c + 1);
        else handleSubmit();
    };

    const handleSubmit = () => {
        if (isEdit && state?.id) {
            updateFriend(state.id, { ...formData });
        } else {
            addFriend({ ...formData, passphrase });
        }
        navigate('/dashboard');
    };

    const renderStepContent = (stepId) => {
        switch (stepId) {
            case 'welcome':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <h1 className="text-4xl font-bold text-text-primary">hello, {initialName}.</h1>
                        <p className="text-xl text-text-secondary max-w-md">welcome to my inner circle. help me keep you close by filling out your card.</p>
                        <div className="pt-8">
                            <Button onClick={next} size="lg" className="px-12 rounded-full lowercase">start</Button>
                        </div>
                    </div>
                );
            case 'basics':
                return (
                    <div className="space-y-6 max-w-md mx-auto pt-10">
                        <h2 className="text-2xl font-bold lowercase">the basics</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">birthday</label>
                                <Input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">anniversary</label>
                                <Input name="anniversary" type="date" value={formData.anniversary} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case 'photo':
                return (
                    <div className="space-y-6 max-w-md mx-auto pt-10 text-center">
                        <h2 className="text-2xl font-bold lowercase">show me your face</h2>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <label className="relative w-40 h-40 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-200 transition-colors group overflow-hidden">
                                {formData.photo ? (
                                    <img src={formData.photo} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-text-secondary group-hover:text-brand transition-colors">
                                        <Icons.Face className="w-8 h-8 opacity-50" />
                                        <span className="lowercase text-sm">upload</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            setFormData({ ...formData, photo: url });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className="space-y-6 max-w-md mx-auto pt-10">
                        <h2 className="text-2xl font-bold lowercase">stay close</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">phone</label>
                                <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="digits" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">email</label>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="digital letter" />
                            </div>
                        </div>
                    </div>
                );
            case 'coordinates':
                return (
                    <div className="space-y-6 max-w-md mx-auto pt-10">
                        <h2 className="text-2xl font-bold lowercase">coordinates</h2>

                        {/* Location Type Toggle */}
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => setLocationType('city')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all lowercase ${locationType === 'city'
                                    ? 'bg-white shadow-sm text-text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                country
                            </button>
                            <button
                                onClick={() => setLocationType('address')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all lowercase ${locationType === 'address'
                                    ? 'bg-white shadow-sm text-text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                full address
                            </button>
                        </div>

                        <div className="space-y-4">
                            {locationType === 'address' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">full address</label>
                                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="street, etc." />
                                    <p className="text-brand text-xs mt-2 lowercase italic">
                                        "i can order something nice for you if you put your full address"
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">country</label>
                                    <select
                                        name="city" // Keeping name 'city' for backward compat or strictly mapping to 'country' now. 
                                        // Plan says Rename City/Country. I will use 'city' field to store country for now to avoid major schema refactor, 
                                        // or better, I should rename the label and keep the field if permissible.
                                        // Let's use the 'city' state field but treat it as location.
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="flex w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 appearance-none lowercase"
                                    >
                                        <option value="">select a country</option>
                                        {Object.values(countries).map((c) => (
                                            <option key={c.name} value={c.name}>{c.name.toLowerCase()}</option>
                                        ))}
                                    </select>
                                </motion.div>
                            )}
                        </div>
                    </div>
                );
            case 'vibe':
                return (
                    <div className="space-y-6 max-w-md mx-auto pt-10">
                        <h2 className="text-2xl font-bold lowercase">the vibe</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">how do we know each other?</label>
                                <Input name="how_we_met" value={formData.how_we_met} onChange={handleChange} placeholder="origin story" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">favorite memory</label>
                                <textarea
                                    name="memory"
                                    value={formData.memory}
                                    onChange={handleChange}
                                    className="flex w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 min-h-[100px] resize-none"
                                    placeholder="that one time..."
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'extra':
                return (
                    <div className="space-y-6 max-w-md mx-auto pt-10">
                        <h2 className="text-2xl font-bold lowercase">extra love</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">gift ideas</label>
                                <Input name="gift_ideas" value={formData.gift_ideas} onChange={handleChange} placeholder="wishlist" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="flex w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 min-h-[100px] resize-none"
                                    placeholder="anything else?"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 items-center justify-center p-4 lowercase">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-5xl h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden flex"
            >
                {/* Sidebar Navigation */}
                <div className="w-64 bg-gray-50 border-r border-gray-100 p-8 flex flex-col hidden md:flex">
                    <div className="mb-10">
                        <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Passkey</div>
                        <div className="font-mono text-brand">{passphrase}</div>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {STEPS.map((step, index) => {
                            if (!step.icon) return null;
                            const Icon = step.icon;
                            const isActive = currentStepIndex === index;
                            const isPast = currentStepIndex > index;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStepIndex(index)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-white shadow-sm text-brand'
                                        : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-gray-400'}`} />
                                    {step.title}
                                    {isPast && <div className="ml-auto text-brand text-xs">✓</div>}
                                </button>
                    </nav>

                    {/* Archive Button for Edit Mode */}
                    {isEdit && (
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <button
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors lowercase"
                                onClick={() => {
                                    // Archive logic here (could be context update, for now just log or navigate)
                                    // Ideally, add archiveFriend to context.
                                    alert('archived (simulated)');
                                    navigate('/dashboard');
                                }}
                            >
                                <span className="text-lg">🗑</span>
                                archive friend
                            </button>
                        </div>
                    )}

                    {/* Explicit Exit Button */}
                    <div className="pt-4 mt-auto">
                        <button
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-xl w-full transition-colors lowercase"
                            onClick={() => navigate('/dashboard')}
                        >
                            <span className="text-lg">✕</span>
                            exit
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative text-left">
                    {/* Pull Tab Close Button */}
                    <div className="absolute top-0 right-8 z-50">
                        <motion.button
                            initial={{ y: -40 }}
                            animate={{ y: 0 }}
                            whileHover={{ y: 5 }}
                            onClick={() => navigate('/dashboard')}
                            className="bg-white border-x border-b border-gray-200 px-6 py-3 rounded-b-xl shadow-sm text-sm font-medium text-text-secondary hover:text-brand flex items-center gap-2 transition-all"
                        >
                            <span className="text-lg leading-none">✕</span>
                            <span className="lowercase">close</span>
                        </motion.button>
                    </div>

                    {/* Progress Bar (Mobile) */}
                    <div className="h-1 bg-gray-100 w-full md:hidden">
                        <motion.div
                            className="h-full bg-brand"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-12 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStepIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full"
                            >
                                {renderStepContent(STEPS[currentStepIndex].id)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    {currentStepIndex > 0 && (
                        <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-white">
                            <Button variant="ghost" onClick={() => setCurrentStepIndex(c => c - 1)} className="lowercase">
                                back
                            </Button>
                            <Button onClick={next} className="min-w-[100px] lowercase">
                                {currentStepIndex === STEPS.length - 1 ? 'finish' : 'next'}
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
