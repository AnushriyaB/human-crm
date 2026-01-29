import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Globe, Briefcase, Heart, Camera, Copy, Check, Eye, EyeOff, ChevronDown, Search, ImagePlus } from 'lucide-react';
import TactileSelect from '../../ui/TactileSelect';
import { useFriends } from '../../../context/FriendContext';

const PRONOUNS = [
    { name: 'he/him', code: 'he/him' },
    { name: 'she/her', code: 'she/her' },
    { name: 'they/them', code: 'they/them' },
    { name: 'other', code: 'other' }
];

const COUNTRIES = [
    { name: 'United States', code: 'US', tz: 'Multiple' },
    { name: 'United Kingdom', code: 'GB', tz: 'GMT (UTC+0)' },
    { name: 'Canada', code: 'CA', tz: 'Multiple' },
    { name: 'Australia', code: 'AU', tz: 'Multiple' },
    { name: 'Germany', code: 'DE', tz: 'CET (UTC+1)' },
    { name: 'France', code: 'FR', tz: 'CET (UTC+1)' },
    { name: 'Japan', code: 'JP', tz: 'JST (UTC+9)' },
    { name: 'India', code: 'IN', tz: 'IST (UTC+5:30)' },
    { name: 'Brazil', code: 'BR', tz: 'BRT (UTC-3)' },
    { name: 'Singapore', code: 'SG', tz: 'SGT (UTC+8)' },
    { name: 'South Korea', code: 'KR', tz: 'KST (UTC+9)' },
    { name: 'New Zealand', code: 'NZ', tz: 'NZST (UTC+12)' },
    { name: 'Ireland', code: 'IE', tz: 'GMT (UTC+0)' },
    { name: 'Sweden', code: 'SE', tz: 'CET (UTC+1)' },
    { name: 'Switzerland', code: 'CH', tz: 'CET (UTC+1)' },
];

const US_STATES = [
    { name: 'California', code: 'CA', tz: 'PST (UTC-8)' },
    { name: 'New York', code: 'NY', tz: 'EST (UTC-5)' },
    { name: 'Texas', code: 'TX', tz: 'CST (UTC-6)' },
    { name: 'Florida', code: 'FL', tz: 'EST (UTC-5)' },
    { name: 'Illinois', code: 'IL', tz: 'CST (UTC-6)' },
    { name: 'Washington', code: 'WA', tz: 'PST (UTC-8)' },
    { name: 'Massachusetts', code: 'MA', tz: 'EST (UTC-5)' },
    { name: 'Colorado', code: 'CO', tz: 'MST (UTC-7)' },
];

const CA_PROVINCES = [
    { name: 'Ontario', code: 'ON', tz: 'EST (UTC-5)' },
    { name: 'Quebec', code: 'QC', tz: 'EST (UTC-5)' },
    { name: 'British Columbia', code: 'BC', tz: 'PST (UTC-8)' },
    { name: 'Alberta', code: 'AB', tz: 'MST (UTC-7)' },
];

const AU_STATES = [
    { name: 'New South Wales', code: 'NSW', tz: 'AEST (UTC+10)' },
    { name: 'Victoria', code: 'VIC', tz: 'AEST (UTC+10)' },
    { name: 'Queensland', code: 'QLD', tz: 'AEST (UTC+10)' },
];

// Tactile input styling
// Tactile input styling matching global Input
const tactileInputClass = `
    w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400
`;

// TactileSelect imported from UI components consistent with CoreIdentityCard/FriendForm

export default function MyIdentityCard({ friend, isEditing, onUpdate, scrollContainerRef }) {
    const { geocodeFriendLocation } = useFriends();
    const photoInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [showPasskey, setShowPasskey] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Track scroll for cover image animation
    useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const progress = Math.min(1, Math.max(0, scrollTop / 200));
            setScrollProgress(progress);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [scrollContainerRef]);

    const handleChange = (field, value) => {
        onUpdate?.({ [field]: value });
    };

    const handleCountryChange = (country) => {
        const updates = {
            country: country.name,
            state: '',
            location: country.name,
        };
        if (country.tz !== 'Multiple') {
            updates.timezone = country.tz;
            setTimeout(() => geocodeFriendLocation?.(friend.id, country.name), 100);
        }
        onUpdate?.(updates);
    };

    const handleStateChange = (state) => {
        const newLocation = `${state.name}, ${friend.country}`;
        onUpdate?.({
            state: state.name,
            timezone: state.tz,
            location: newLocation
        });
        setTimeout(() => geocodeFriendLocation?.(friend.id, newLocation), 100);
    };

    const getStatesForCountry = (countryName) => {
        if (countryName === 'United States') return US_STATES;
        if (countryName === 'Canada') return CA_PROVINCES;
        if (countryName === 'Australia') return AU_STATES;
        return null;
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate?.({ photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate?.({ coverPhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopyPasskey = async () => {
        if (friend.passphrase) {
            try {
                await navigator.clipboard.writeText(friend.passphrase);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const maskPasskey = (passkey) => {
        if (!passkey) return '';
        return '•'.repeat(passkey.length);
    };

    const states = getStatesForCountry(friend.country);

    const getGradient = () => {
        const colors = [
            'from-violet-400 to-purple-500',
            'from-blue-400 to-indigo-500',
            'from-emerald-400 to-teal-500',
            'from-orange-400 to-rose-500',
            'from-pink-400 to-fuchsia-500',
        ];
        const hash = (friend.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const locationString = [friend.state, friend.country].filter(Boolean).join(', ');

    // Cover image height animates on scroll (shrinks as you scroll)
    const coverHeight = 180 - (scrollProgress * 100); // 180px -> 80px

    return (
        <div className="space-y-6">
            {/* Cover Image & Avatar container */}
            <div className="relative mb-20">
                {/* Cover Image - animates height on scroll */}
                <div
                    className="relative w-full overflow-hidden rounded-[4px] transition-all duration-150 ease-out"
                    style={{ height: `${coverHeight}px` }}
                >
                    {/* Background gradient */}
                    {/* Glass Frame Background (subtle gradient + visible border) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 border border-black/5 shadow-inner" />

                    {/* Cover photo */}
                    {friend.coverPhoto && (
                        <img
                            src={friend.coverPhoto}
                            alt="Cover"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}

                    {/* Cover upload button (edit mode) */}
                    {isEditing && (
                        <>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                            >
                                <ImagePlus size={18} />
                            </button>
                        </>
                    )}

                </div>

                {/* Avatar - positioned absolutely relative to parent, sticking out of cover */}
                <div className="absolute -bottom-10 left-6 z-10">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden relative">
                            {friend.photo ? (
                                <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-400">{(friend.name || '?').charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <>
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => photoInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Camera size={20} className="text-white" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer no longer needed as margin handled by mb-12 on parent */}

            {/* Form Fields - no card wrapper, clean form layout */}
            <div className="space-y-5">
                {/* Name */}
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={friend.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Your name"
                            className={`${tactileInputClass} text-xl font-bold`}
                        />
                    ) : (
                        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                            {friend.name || 'Unnamed'}
                        </h2>
                    )}
                </div>

                {/* Metadata row - view mode */}
                {!isEditing && (friend.pronouns || friend.timezone || locationString) && (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                        {friend.pronouns && (
                            <span className="px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)]">{friend.pronouns}</span>
                        )}
                        {locationString && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {locationString}
                            </span>
                        )}
                        {friend.timezone && (
                            <span className="flex items-center gap-1.5">
                                <Globe size={14} />
                                {friend.timezone.split(' ')[0]}
                            </span>
                        )}
                    </div>
                )}

                {/* Current Role - view mode */}
                {!isEditing && friend.currentRole && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Briefcase size={14} />
                        <span>{friend.currentRole}</span>
                    </div>
                )}

                {/* Bio - view mode */}
                {!isEditing && friend.bio && (
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">{friend.bio}</p>
                )}

                {/* Edit Mode Fields */}
                {isEditing && (
                    <div className="space-y-4">
                        {/* Pronouns */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">pronouns</label>
                            <TactileSelect
                                value={friend.pronouns}
                                onChange={(opt) => handleChange('pronouns', opt.code)}
                                options={PRONOUNS}
                                placeholder="select..."
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">about me</label>
                            <textarea
                                placeholder="A short bio about yourself..."
                                value={friend.bio || ''}
                                onChange={(e) => handleChange('bio', e.target.value)}
                                className={`${tactileInputClass} resize-none`}
                                rows={3}
                            />
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">country</label>
                                <TactileSelect
                                    value={friend.country}
                                    onChange={handleCountryChange}
                                    options={COUNTRIES}
                                    placeholder="select..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">
                                    {friend.country === 'Canada' ? 'province' : 'state/region'}
                                </label>
                                {states ? (
                                    <TactileSelect
                                        value={friend.state}
                                        onChange={handleStateChange}
                                        options={states}
                                        placeholder="Select..."
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="City or region"
                                        value={friend.state || ''}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        className={tactileInputClass}
                                    />
                                )}
                            </div>
                        </div>

                        {/* What I Do */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">what i do</label>
                            <input
                                type="text"
                                placeholder="Designer at Acme, Student..."
                                value={friend.currentRole || ''}
                                onChange={(e) => handleChange('currentRole', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>
                    </div>
                )}

                {/* Passkey Section */}
                {friend.passphrase && (
                    <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-secondary)] mb-2">Share this passkey with friends:</p>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-secondary)]">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-[var(--color-brand)]">
                                    {showPasskey ? friend.passphrase : maskPasskey(friend.passphrase)}
                                </span>
                                <button
                                    onClick={() => setShowPasskey(!showPasskey)}
                                    className="p-1 hover:bg-white rounded transition-colors"
                                >
                                    {showPasskey ? (
                                        <EyeOff size={14} className="text-[var(--color-text-secondary)]" />
                                    ) : (
                                        <Eye size={14} className="text-[var(--color-text-secondary)]" />
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={handleCopyPasskey}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${copied
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-white hover:bg-[var(--color-brand)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] border border-[var(--color-border)]'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check size={12} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={12} />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
