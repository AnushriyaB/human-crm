import React, { useState, useMemo, useRef } from 'react';
import { User, MapPin, Globe, Users, Handshake, ChevronDown, Search, Camera, Copy, Check, Eye, EyeOff, Briefcase, ImagePlus } from 'lucide-react';
import { useFriends } from '../../../context/FriendContext';

const PRONOUNS = [
    { label: 'he/him', value: 'he/him' },
    { label: 'she/her', value: 'she/her' },
    { label: 'they/them', value: 'they/them' },
    { label: 'other', value: 'other' }
];

const RELATIONSHIP_TYPES = [
    'friend', 'family', 'partner', 'ex-coworker', 'coworker',
    'classmate', 'neighbor', 'mentor', 'client', 'other'
];

// Countries with their timezones
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
    { name: 'Mexico', code: 'MX', tz: 'Multiple' },
    { name: 'Spain', code: 'ES', tz: 'CET (UTC+1)' },
    { name: 'Italy', code: 'IT', tz: 'CET (UTC+1)' },
    { name: 'Netherlands', code: 'NL', tz: 'CET (UTC+1)' },
    { name: 'Singapore', code: 'SG', tz: 'SGT (UTC+8)' },
    { name: 'South Korea', code: 'KR', tz: 'KST (UTC+9)' },
    { name: 'China', code: 'CN', tz: 'CST (UTC+8)' },
    { name: 'New Zealand', code: 'NZ', tz: 'NZST (UTC+12)' },
    { name: 'Ireland', code: 'IE', tz: 'GMT (UTC+0)' },
    { name: 'Sweden', code: 'SE', tz: 'CET (UTC+1)' },
    { name: 'Switzerland', code: 'CH', tz: 'CET (UTC+1)' },
];

// US States with timezones (abbreviated for brevity)
const US_STATES = [
    { name: 'California', code: 'CA', tz: 'PST (UTC-8)' },
    { name: 'New York', code: 'NY', tz: 'EST (UTC-5)' },
    { name: 'Texas', code: 'TX', tz: 'CST (UTC-6)' },
    { name: 'Florida', code: 'FL', tz: 'EST (UTC-5)' },
    { name: 'Illinois', code: 'IL', tz: 'CST (UTC-6)' },
    { name: 'Washington', code: 'WA', tz: 'PST (UTC-8)' },
    { name: 'Massachusetts', code: 'MA', tz: 'EST (UTC-5)' },
    { name: 'Colorado', code: 'CO', tz: 'MST (UTC-7)' },
    { name: 'Georgia', code: 'GA', tz: 'EST (UTC-5)' },
    { name: 'Arizona', code: 'AZ', tz: 'MST (UTC-7)' },
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
const tactileInputClass = `
    w-full px-4 py-3 text-sm rounded-xl
    bg-[var(--color-bg-secondary)]
    border border-[var(--color-border)]
    shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
    focus:outline-none focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_0_0_3px_rgba(124,92,255,0.15)]
    focus:border-[var(--color-brand)]
    transition-all duration-200
    placeholder:text-gray-400
`;

const tactileSelectClass = `
    w-full px-4 py-3 text-sm rounded-xl
    bg-[var(--color-bg-secondary)]
    border border-[var(--color-border)]
    shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
    focus:outline-none focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_0_0_3px_rgba(124,92,255,0.15)]
    focus:border-[var(--color-brand)]
    transition-all duration-200
    cursor-pointer
`;

// Pill/chip component for metadata
function Pill({ children, className = '' }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] ${className}`}>
            {children}
        </span>
    );
}

// Searchable dropdown with tactile styling
function TactileSelect({ value, onChange, options, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(opt =>
            opt.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const selectedOption = options.find(opt => opt.name === value || opt.code === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`${tactileSelectClass} text-left flex items-center justify-between`}
            >
                <span className={selectedOption ? '' : 'text-gray-400'}>
                    {selectedOption?.name || placeholder}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-[var(--color-border)]">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${tactileInputClass} pl-9`}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt.code}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--color-bg-secondary)] transition-colors ${selectedOption?.code === opt.code ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : ''}`}
                                >
                                    {opt.name}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CoreIdentityCard({ friend, isEditing, onUpdate }) {
    const { geocodeFriendLocation } = useFriends();
    const photoInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [showPasskey, setShowPasskey] = useState(false);

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

    // Generate gradient based on friend name
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

    // Build location string
    const locationString = [friend.state, friend.country].filter(Boolean).join(', ');

    return (
        <div className="space-y-6">
            {/* Cover Image */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                {friend.coverPhoto ? (
                    <img
                        src={friend.coverPhoto}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient()}`} />
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

                {/* Avatar - overlapping the cover */}
                <div className="absolute -bottom-10 left-5">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden">
                            {friend.photo ? (
                                <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
                                    <span className="text-2xl font-bold text-white">{(friend.name || '?').charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>

                        {/* Avatar upload overlay */}
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
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Camera size={20} className="text-white" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer for avatar overlap */}
            <div className="h-6" />

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name - always visible, editable inline */}
                {isEditing ? (
                    <input
                        type="text"
                        value={friend.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Their name"
                        className={`${tactileInputClass} text-xl font-bold`}
                    />
                ) : (
                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        {friend.name || 'Unnamed'}
                    </h2>
                )}

                {/* Metadata pills row */}
                {!isEditing && (
                    <div className="flex flex-wrap gap-2">
                        {friend.pronouns && <Pill>{friend.pronouns}</Pill>}
                        {friend.relationshipType && <Pill>{friend.relationshipType}</Pill>}
                        {friend.timezone && <Pill>🕐 {friend.timezone.split(' ')[0]}</Pill>}
                    </div>
                )}

                {/* Location line */}
                {!isEditing && locationString && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <MapPin size={14} />
                        <span>{locationString}</span>
                    </div>
                )}

                {/* Role/What they do */}
                {!isEditing && friend.role && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Briefcase size={14} />
                        <span>{friend.role}</span>
                    </div>
                )}

                {/* How you met */}
                {!isEditing && friend.howMet && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Handshake size={14} />
                        <span>{friend.howMet}</span>
                    </div>
                )}

                {/* Edit Mode Fields */}
                {isEditing && (
                    <div className="space-y-4 pt-2">
                        {/* Nickname */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Nickname</label>
                            <input
                                type="text"
                                placeholder="What do you call them?"
                                value={friend.nickname || ''}
                                onChange={(e) => handleChange('nickname', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>

                        {/* Pronouns + Connection Type Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Pronouns</label>
                                <select
                                    value={friend.pronouns || ''}
                                    onChange={(e) => handleChange('pronouns', e.target.value)}
                                    className={tactileSelectClass}
                                >
                                    <option value="">Select...</option>
                                    {PRONOUNS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Connection</label>
                                <select
                                    value={friend.relationshipType || ''}
                                    onChange={(e) => handleChange('relationshipType', e.target.value)}
                                    className={tactileSelectClass}
                                >
                                    <option value="">Select...</option>
                                    {RELATIONSHIP_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Country</label>
                                <TactileSelect
                                    value={friend.country}
                                    onChange={handleCountryChange}
                                    options={COUNTRIES}
                                    placeholder="Select..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                                    {friend.country === 'Canada' ? 'Province' : 'State/Region'}
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

                        {/* Role */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">What they do</label>
                            <input
                                type="text"
                                placeholder="Designer at Acme, Student..."
                                value={friend.role || ''}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>

                        {/* How you met */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">How you met</label>
                            <input
                                type="text"
                                placeholder="At a coffee shop, through a friend..."
                                value={friend.howMet || ''}
                                onChange={(e) => handleChange('howMet', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>
                    </div>
                )}

                {/* Passkey Section */}
                {friend.passphrase && !friend.hasJoined && (
                    <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-secondary)]">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--color-text-secondary)]">Passkey:</span>
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
