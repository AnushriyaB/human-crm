import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useFriends } from '../context/FriendContext';
import { Icons } from '../components/ui/Icons';
import { CustomSelect } from '../components/ui/CustomSelect';
import { DynamicInput } from '../components/ui/DynamicInput';
import { DateSelector } from '../components/ui/DateSelector';
import { countries } from 'countries-list';

const STEPS = [
    { id: 'welcome', title: 'welcome', icon: null },
    { id: 'basics', title: 'basics', icon: Icons.Basics },
    { id: 'photo', title: 'face', icon: Icons.Face },
    { id: 'contact', title: 'contact', icon: Icons.Contact },
    { id: 'socials', title: 'socials', icon: Icons.Sparkles }, // Using Sparkles as temp icon for socials or maybe we add one?
    { id: 'location', title: 'location', icon: Icons.Coordinates },
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
    const [locationType, setLocationType] = useState(state?.address ? 'address' : 'city');

    const [formData, setFormData] = useState({
        name: initialName,
        photos: state?.photos || (state?.photo ? [state.photo] : []),
        birthday: state?.birthday || '',
        anniversary: state?.anniversary || '',
        partner: state?.partner || '',
        phone: state?.phone || '',
        email: state?.email || '',
        socials: state?.socials || { instagram: '', twitter: '', linkedin: '' },
        address: state?.address || '',
        city: state?.city || '',
        zip: state?.zip || '',
        memory: state?.memory || '',
        how_we_met: state?.how_we_met || '',
        notes: state?.notes || '',
        gift_ideas: state?.gift_ideas || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e) => {
        setFormData({
            ...formData,
            socials: { ...formData.socials, [e.target.name]: e.target.value }
        });
    };

    const next = () => {
        if (currentStepIndex < STEPS.length - 1) setCurrentStepIndex(c => c + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        if (isEdit && state?.id) {
            await updateFriend(state.id, { ...formData });
        } else {
            await addFriend({ ...formData, passphrase });
        }
        navigate('/dashboard');
    };

    const clearStep = () => {
        const step = STEPS[currentStepIndex];
        let updates = {};
        switch (step.id) {
            case 'basics': updates = { birthday: '', anniversary: '' }; break;
            case 'photo': updates = { photos: [] }; break;
            case 'contact': updates = { phone: '', email: '' }; break;
            case 'socials': updates = { socials: { instagram: '', twitter: '', linkedin: '' } }; break;
            case 'location': updates = { address: '', city: '', zip: '' }; break;
            case 'vibe': updates = { how_we_met: '', memory: '' }; break;
            case 'extra': updates = { gift_ideas: '', notes: '' }; break;
        }
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const renderStepContent = (stepId) => {
        // Animation variant for "Left to Right" load
        const contentVariants = {
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }
        };

        const itemVariants = {
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0 }
        };

        const Wrapper = ({ children }) => (
            <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: 20 }}
                className="w-full max-w-md mx-auto pt-10"
            >
                {children}
            </motion.div>
        );

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
                    <Wrapper>
                        <div className="space-y-10">
                            <motion.div variants={itemVariants} className="flex flex-col gap-3 items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase">birthday</label>
                                <DateSelector value={formData.birthday} onChange={(val) => setFormData({ ...formData, birthday: val })} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col gap-3 items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase">anniversary</label>
                                <DateSelector value={formData.anniversary} onChange={(val) => setFormData({ ...formData, anniversary: val })} />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'photo':
                return (
                    <div className="space-y-6 w-full max-w-lg mx-auto pt-10 text-center">
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="flex -space-x-4 items-center justify-center">
                                {/* No AnimatePresence popping, just mapping */}
                                {formData.photos.map((photoUrl, index) => (
                                    <div
                                        key={`photo-${index}`}
                                        className="relative w-24 h-24 rounded-full bg-gray-100 flex-shrink-0 z-10 hover:z-20 hover:scale-105 transition-transform overflow-hidden border-2 border-white"
                                    >
                                        <img src={photoUrl} alt="uploaded" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const newPhotos = formData.photos.filter((_, i) => i !== index);
                                                setFormData({ ...formData, photos: newPhotos });
                                            }}
                                            className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            <span className="text-white text-lg">✕</span>
                                        </button>
                                    </div>
                                ))}

                                {formData.photos.length < 5 && (
                                    <label className="relative w-24 h-24 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-all z-0 ml-4 group border border-dashed border-gray-300">
                                        <Icons.Image className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const url = URL.createObjectURL(e.target.files[0]);
                                                    setFormData({ ...formData, photos: [...formData.photos, url] });
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <Wrapper>
                        <div className="space-y-8 text-center">
                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">phone</label>
                                <DynamicInput name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className="text-xl lg:text-2xl w-full text-center" />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">email</label>
                                <DynamicInput name="email" type="email" value={formData.email} onChange={handleChange} placeholder="hello@example.com" className="text-xl lg:text-2xl w-full text-center" />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'socials':
                return (
                    <Wrapper>
                        <div className="space-y-6 text-center">
                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">instagram</label>
                                <DynamicInput name="instagram" value={formData.socials.instagram} onChange={handleSocialChange} placeholder="@username" className="text-xl w-full text-center" />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">twitter / x</label>
                                <DynamicInput name="twitter" value={formData.socials.twitter} onChange={handleSocialChange} placeholder="@username" className="text-xl w-full text-center" />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'location':
                return (
                    <div className="space-y-6 w-full max-w-md mx-auto pt-10">
                        <div className="relative flex bg-gray-100 p-1 rounded-full mb-8 w-64 mx-auto">
                            <motion.div
                                className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm z-0"
                                layoutId="activeTab"
                                initial={false}
                                animate={{
                                    left: locationType === 'city' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                            <button onClick={() => setLocationType('city')} className={`flex-1 relative z-10 py-1.5 text-sm font-medium transition-colors lowercase ${locationType === 'city' ? 'text-text-primary' : 'text-text-secondary'}`}>country</button>
                            <button onClick={() => setLocationType('address')} className={`flex-1 relative z-10 py-1.5 text-sm font-medium transition-colors lowercase ${locationType === 'address' ? 'text-text-primary' : 'text-text-secondary'}`}>full address</button>
                        </div>

                        <div className="space-y-4 min-h-[120px]">
                            {locationType === 'address' ? (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="pt-2 space-y-4 text-center"
                                >
                                    <label className="text-sm font-medium text-text-secondary lowercase mb-2 block text-center">where should i send it?</label>
                                    <div className="space-y-4 flex flex-col items-center">
                                        <DynamicInput name="address" value={formData.address} onChange={handleChange} placeholder="street address" className="text-xl w-full text-center" />
                                        <div className="flex gap-4 w-full">
                                            <DynamicInput name="city" value={formData.city} onChange={handleChange} placeholder="city" className="text-lg w-2/3 text-center" />
                                            <DynamicInput name="zip" value={formData.zip} onChange={handleChange} placeholder="zip" className="text-lg w-1/3 text-center" />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="country"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="pt-2"
                                >
                                    <CustomSelect
                                        options={Object.values(countries).map(c => ({ label: c.name.toLowerCase(), value: c.name }))}
                                        value={formData.city}
                                        onChange={(val) => setFormData({ ...formData, city: val })}
                                        placeholder="search countries..."
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                );
            case 'vibe':
                return (
                    <Wrapper>
                        <div className="space-y-8">
                            <motion.div variants={itemVariants}>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">how did we meet?</label>
                                <DynamicInput name="how_we_met" value={formData.how_we_met} onChange={handleChange} placeholder="origin story" className="text-xl w-full" />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">favorite memory</label>
                                <textarea
                                    name="memory"
                                    value={formData.memory}
                                    onChange={handleChange}
                                    className="flex w-full bg-transparent border-none px-0 py-2 text-text-primary placeholder:text-gray-300 focus:outline-none min-h-[80px] resize-none transition-colors text-lg caret-brand"
                                    placeholder="..."
                                />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'extra':
                return (
                    <Wrapper>
                        <div className="space-y-8">
                            <motion.div variants={itemVariants}>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">gift ideas</label>
                                <DynamicInput name="gift_ideas" value={formData.gift_ideas} onChange={handleChange} placeholder="wishlist" className="text-xl w-full" />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="flex w-full bg-transparent border-none px-0 py-2 text-text-primary placeholder:text-gray-300 focus:outline-none min-h-[80px] resize-none transition-colors text-lg caret-brand"
                                    placeholder="..."
                                />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            default:
                return null;
        }
    }

    return (
        <div className="flex h-screen w-full bg-white items-center justify-center p-4 lowercase font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl h-[80vh] flex bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100"
            >
                {/* Sidebar Navigation */}
                <div className="w-64 border-r border-gray-100 p-8 flex flex-col hidden md:flex">
                    <div className="mb-10">
                        <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Passkey</div>
                        <div className="font-mono text-brand truncate pr-2" title={passphrase}>{passphrase}</div>
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-brand bg-brand/5' : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-gray-400'}`} />
                                    {step.title}
                                    {isPast && <div className="ml-auto text-brand text-xs">✓</div>}
                                </button>
                            )
                        })}
                    </nav>

                    {/* Archive Button for Edit Mode */}
                    {isEdit && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-500 rounded-xl w-full transition-colors lowercase hover:bg-red-50"
                                onClick={() => {
                                    navigate('/dashboard');
                                }}
                            >
                                <span className="text-lg">🗑</span>
                                archive friend
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative text-left">
                    {/* Integrated Close Button (Top Right) */}
                    <div className="absolute top-6 right-6 z-50">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:border-gray-300 flex items-center gap-2 transition-all shadow-sm"
                        >
                            <span className="text-lg leading-none">✕</span>
                            <span className="lowercase">close</span>
                        </button>
                    </div>

                    {/* Progress Bar (Mobile) */}
                    <div className="h-1 bg-gray-100 w-full md:hidden">
                        <motion.div
                            className="h-full bg-brand"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto relative flex flex-col">
                        <div className="flex-1 flex flex-col justify-center p-12">
                            <AnimatePresence mode="wait">
                                {/* Key change ensures re-render of Wrapper and triggered staggering */}
                                <motion.div key={currentStepIndex} className="w-full flex justify-center">
                                    {renderStepContent(STEPS[currentStepIndex].id)}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {currentStepIndex > 0 && (
                        <div className="p-8 flex justify-between items-center sticky bottom-0 z-20 bg-white/80 backdrop-blur-sm">
                            <Button variant="ghost" onClick={clearStep} className="text-text-secondary text-xs hover:text-red-400 lowercase hover:bg-red-50 rounded-lg px-4">
                                clear
                            </Button>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setCurrentStepIndex(c => c - 1)} className="lowercase rounded-xl hover:bg-gray-50">
                                    back
                                </Button>
                                <Button onClick={next} className="min-w-[120px] lowercase rounded-xl shadow-lg shadow-brand/20">
                                    {currentStepIndex === STEPS.length - 1 ? 'finish' : 'next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
