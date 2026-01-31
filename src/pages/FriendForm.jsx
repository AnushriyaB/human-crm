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
import { PhoneInput } from '../components/ui/PhoneInput';
import { EmailInput } from '../components/ui/EmailInput';
import { countries } from 'countries-list';
import { Check, Copy } from 'lucide-react';
import TactileSelect from '../components/ui/TactileSelect';

const tactileInputClass = `
    w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400
`;

const STEPS = [
    { id: 'welcome', title: 'welcome', icon: null },
    { id: 'basics', title: 'basics', icon: Icons.Basics },
    { id: 'photo', title: 'face', icon: Icons.Face },
    { id: 'contact', title: 'contact', icon: Icons.Contact },
    { id: 'socials', title: 'socials', icon: Icons.Link },
    { id: 'location', title: 'location', icon: Icons.Coordinates },
    { id: 'vibe', title: 'vibe', icon: Icons.Vibe },
    { id: 'extra', title: 'extra love', icon: Icons.ExtraLove }
];

// Moving variants and wrapper outside to prevent re-creation on every render
const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }
};

const PRONOUNS = [
    { name: 'he/him', code: 'he/him' },
    { name: 'she/her', code: 'she/her' },
    { name: 'they/them', code: 'they/them' },
    { name: 'other', code: 'other' }
];

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
        className="w-full max-w-sm mx-auto pt-10"
    >
        {children}
    </motion.div>
);

export default function FriendForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addFriend, updateFriend } = useFriends();

    const initialName = state?.name || 'friend';
    const passphrase = state?.passphrase || '';
    const isGuest = state?.isGuest || false;
    const isEdit = state?.isEdit || false;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const [formData, setFormData] = useState({
        name: initialName,
        photos: state?.photos || (state?.photo ? [state.photo] : []),
        birthday: state?.birthday || '',
        anniversary: state?.anniversary || '',
        pronouns: state?.pronouns || '',
        role: state?.role || '',
        phone: state?.phone || '',
        email: state?.email || '',
        socials: state?.socials || { instagram: '', twitter: '', linkedin: '' },
        address: state?.address || '',
        country: state?.country || state?.city || '', // Map city to country
        state: state?.state || '',
        howMet: state?.howMet || state?.how_we_met || '', // Map how_we_met to howMet
        memory: state?.memory || '',
        notes: state?.notes || '',
        gift_ideas: state?.gift_ideas || ''
    });

    const handleCopyPasskey = async () => {
        await navigator.clipboard.writeText(passphrase);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (e) => {
        let value = e.target.value;
        // Enforce number-only for phone
        if (e.target.name === 'phone') {
            value = value.replace(/\D/g, '');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSocialChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        // Auto-extract handle from URL
        if (value.includes('instagram.com/')) {
            value = '@' + value.split('instagram.com/')[1].split('/')[0].split('?')[0];
        } else if (value.includes('twitter.com/') || value.includes('x.com/')) {
            const parts = value.split('/');
            value = '@' + parts[parts.length - 1].split('?')[0];
        } else if (value.includes('linkedin.com/in/')) {
            const parts = value.split('linkedin.com/in/');
            value = '@' + parts[1].split('/')[0];
        }

        setFormData({
            ...formData,
            socials: { ...formData.socials, [name]: value }
        });
    };

    const next = () => {
        if (currentStepIndex < STEPS.length - 1) setCurrentStepIndex(c => c + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        // Construct modules
        const modules = [];

        // Communication Module
        if (formData.phone || formData.email || Object.values(formData.socials).some(v => v)) {
            const socialLinks = Object.entries(formData.socials)
                .filter(([_, handle]) => handle)
                .map(([platform, handle]) => ({ platform, handle }));

            modules.push({
                type: 'communication',
                data: {
                    phone: formData.phone,
                    email: formData.email,
                    socialLinks
                }
            });
        }

        // Timeline Module
        if (formData.birthday || formData.anniversary) {
            modules.push({
                type: 'timeline',
                data: {
                    birthday: formData.birthday,
                    anniversary: formData.anniversary
                }
            });
        }

        // Favorites Module
        if (formData.gift_ideas) {
            modules.push({
                type: 'favorites',
                data: {
                    giftIdeas: formData.gift_ideas
                }
            });
        }

        // Determine enabled tabs
        const enabledTabs = ['about']; // Always enable about
        if (modules.some(m => m.type === 'favorites')) enabledTabs.push('favorites');
        if (modules.some(m => m.type === 'communication')) enabledTabs.push('connect');

        const submissionData = {
            ...formData,
            passphrase,
            modules,
            enabledTabs
        };

        if (isEdit && state?.id) {
            await updateFriend(state.id, submissionData);
        } else {
            await addFriend(submissionData);
        }

        if (isGuest) {
            navigate('/thank-you');
        } else {
            navigate('/dashboard');
        }
    };

    const clearStep = () => {
        const step = STEPS[currentStepIndex];
        let updates = {};
        switch (step.id) {
            case 'basics': updates = { birthday: '', anniversary: '', pronouns: '', role: '' }; break;
            case 'photo': updates = { photos: [] }; break;
            case 'contact': updates = { phone: '', email: '' }; break;
            case 'socials': updates = { socials: { instagram: '', twitter: '', linkedin: '' } }; break;
            case 'location': updates = { address: '', country: '', state: '' }; break;
            case 'vibe': updates = { howMet: '', memory: '' }; break;
            case 'extra': updates = { gift_ideas: '', notes: '' }; break;
        }
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const renderStepContent = (stepId) => {

        switch (stepId) {
            case 'welcome':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <h1 className="text-4xl font-bold text-text-primary">hello, {initialName}.</h1>
                        <p className="text-xl text-text-secondary max-w-md">welcome to my inner circle. help me keep you close by filling out your card.</p>
                        <div className="pt-8">
                            <Button onClick={next} size="lg" className="px-12 py-6 text-lg rounded-[8px] lowercase shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all bg-brand text-white border-none">start</Button>
                        </div>
                    </div>
                );
            case 'basics':
                return (
                    <Wrapper>
                        <div className="space-y-6">
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary lowercase">birthday</label>
                                <DateSelector value={formData.birthday} onChange={(val) => setFormData({ ...formData, birthday: val })} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary lowercase">anniversary</label>
                                <DateSelector value={formData.anniversary} onChange={(val) => setFormData({ ...formData, anniversary: val })} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary lowercase">pronouns</label>
                                <TactileSelect
                                    value={formData.pronouns}
                                    onChange={(opt) => setFormData({ ...formData, pronouns: opt.code })}
                                    options={PRONOUNS}
                                    placeholder="select..."
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary lowercase">what do you do?</label>
                                <input
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="job title, student..."
                                    className={tactileInputClass}
                                />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'photo':
                return (
                    <div className="space-y-6 w-full max-w-sm mx-auto pt-10 text-center">
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="flex -space-x-4 items-center justify-center">
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
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center shadow-lg">✕</span>
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
                                <label className="text-sm font-medium text-text-secondary lowercase mb-4 block">phone</label>
                                {/* 10 boxes phone input */}
                                <PhoneInput value={formData.phone} onChange={handleChange} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-4 block">email</label>
                                {/* User @ Domain input */}
                                <EmailInput value={formData.email} onChange={handleChange} className="w-full" />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'socials':
                return (
                    <Wrapper>
                        <div className="space-y-6 text-center">
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">instagram</label>
                                <input name="instagram" value={formData.socials.instagram} onChange={handleSocialChange} placeholder="@username" className={tactileInputClass} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">twitter / x</label>
                                <input name="twitter" value={formData.socials.twitter} onChange={handleSocialChange} placeholder="@username" className={tactileInputClass} />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'location':
                return (
                    <Wrapper>
                        <div className="space-y-6 w-full max-w-sm mx-auto pt-10 text-center">
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-4 block">country</label>
                                <CustomSelect
                                    options={Object.values(countries).map(c => ({ label: c.name.toLowerCase(), value: c.name }))}
                                    value={formData.country}
                                    onChange={(val) => setFormData({ ...formData, country: val })}
                                    placeholder="select country..."
                                    className="w-full"
                                />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'vibe':
                return (
                    <Wrapper>
                        <div className="space-y-8 text-center">
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">how did we meet?</label>
                                <input name="howMet" value={formData.howMet} onChange={handleChange} placeholder="origin story" className={tactileInputClass} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">favorite memory</label>
                                <textarea
                                    name="memory"
                                    value={formData.memory}
                                    onChange={handleChange}
                                    placeholder="..."
                                    className={`${tactileInputClass} resize-none`}
                                    rows={3}
                                />
                            </motion.div>
                        </div>
                    </Wrapper>
                );
            case 'extra':
                return (
                    <Wrapper>
                        <div className="space-y-8 text-center">
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">gift ideas</label>
                                <input name="gift_ideas" value={formData.gift_ideas} onChange={handleChange} placeholder="wishlist" className={tactileInputClass} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <label className="text-sm font-medium text-text-secondary lowercase mb-2 block">notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="..."
                                    className={`${tactileInputClass} resize-none`}
                                    rows={3}
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
                className="w-full max-w-4xl h-[80vh] flex bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100"
            >
                {/* Sidebar Navigation */}
                <div className="w-[300px] border-r border-gray-100 p-10 flex flex-col hidden md:flex bg-gray-50/30">
                    <div className="mb-12 group cursor-copy" onClick={handleCopyPasskey}>
                        {passphrase && (
                            <>
                                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-2 group-hover:text-brand transition-colors">
                                    Passkey
                                    {copied && <Check size={12} style={{ color: '#047857' }} />}
                                </div>
                                <div className="font-mono text-xl text-brand truncate pr-2 group-hover:underline decoration-brand underline-offset-4 transition-all" title={passphrase}>
                                    {copied ? <span style={{ color: '#047857' }}>Copied!</span> : passphrase}
                                </div>
                            </>
                        )}
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-medium transition-all ${isActive ? 'text-brand bg-brand/5 shadow-[inset_0_2px_4px_0_rgba(59,130,246,0.1)]' : 'text-text-secondary hover:text-text-primary bg-[var(--color-button-bg)] shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.05),inset_0_2px_4px_0_rgba(255,255,255,0.5)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05),inset_0_-2px_4px_0_rgba(255,255,255,0.5)]'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-gray-400'}`} />
                                    {isPast && <div className="text-brand text-xs">✓</div>}
                                    {step.title}
                                </button>
                            )
                        })}
                    </nav>

                    {/* Archive Button for Edit Mode */}
                    {isEdit && !isGuest && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-500 rounded-[2px] w-full transition-all lowercase bg-[var(--color-button-bg)] shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.05),inset_0_2px_4px_0_rgba(255,255,255,0.5)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05),inset_0_-2px_4px_0_rgba(255,255,255,0.5)] hover:bg-red-50"
                                onClick={() => {
                                    navigate('/dashboard');
                                }}
                            >
                                <Icons.Trash className="w-4 h-4" />
                                archive friend
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative text-left">
                    {/* Integrated Close Button (Top Right) */}
                    {!isGuest && (
                        <div className="absolute top-6 right-6 z-50">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-[var(--color-button-bg)] border border-[var(--color-border)] px-6 py-3 rounded-[2px] text-sm font-medium text-text-secondary hover:text-text-primary transition-all flex items-center gap-2 group shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]"
                            >
                                <span className="lowercase">close</span>
                            </button>
                        </div>
                    )}

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
                            <Button variant="ghost" onClick={clearStep} className="text-text-secondary text-sm hover:text-red-400 lowercase hover:bg-red-50 rounded-[8px] px-4">
                                clear
                            </Button>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setCurrentStepIndex(c => c - 1)} className="lowercase rounded-[8px] hover:bg-gray-50 text-sm">
                                    back
                                </Button>
                                <Button onClick={next} className="min-w-[120px] lowercase rounded-[8px] shadow-lg shadow-brand/20 text-sm">
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
