import React, { useState, useMemo, useRef } from 'react';
import { Handshake, Sparkles, MapPin, Briefcase, Camera, Plus, X, ImagePlus, User, Hand, Heart, Eye, EyeOff, Check, Copy } from 'lucide-react';
import TactileSelect from '../../ui/TactileSelect';
import { useFriends } from '../../../context/FriendContext';

const PRONOUNS = [
    { name: 'he/him', code: 'he/him' },
    { name: 'she/her', code: 'she/her' },
    { name: 'they/them', code: 'they/them' },
    { name: 'other', code: 'other' }
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

const tactileSelectClass = `
    appearance-none
    ${tactileInputClass}
`;


// Pill/chip component for metadata
function Pill({ children, className = '' }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] ${className}`}>
            {children}
        </span>
    );
}

// TactileSelect imported from UI components consistent with MyIdentityCard/FriendForm

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
            {/* Photo Gallery Header (Reduced Height, No Circles) */}
            <div className="relative mb-6 -mx-6 px-6 pt-6 pb-2 bg-[var(--color-bg-secondary)]/10 border-b border-[var(--color-border)] overflow-hidden">
                {/* Gallery Scroll */}
                <div className="relative z-10 flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory items-center">
                    {friend.photos && friend.photos.length > 0 ? (
                        friend.photos.map((photo, i) => (
                            <div key={i} className="flex-shrink-0 w-32 h-40 rounded-lg bg-white shadow-sm border border-[var(--color-border)] overflow-hidden snap-center relative group">
                                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            const newPhotos = friend.photos.filter((_, idx) => idx !== i);
                                            handleChange('photos', newPhotos);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (friend.photo) ? (
                        // Fallback for legacy single photo
                        <div className="flex-shrink-0 w-32 h-40 rounded-lg bg-white shadow-sm border border-[var(--color-border)] overflow-hidden snap-center">
                            <img src={friend.photo} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex-shrink-0 w-32 h-40 rounded-lg bg-white/50 border-2 border-dashed border-[var(--color-border)] flex items-center justify-center">
                            <Camera className="text-[var(--color-text-secondary)] opacity-50" size={24} />
                        </div>
                    )}

                    {/* Add Photo Button (Edit Mode) */}
                    {isEditing && (
                        <div className="flex-shrink-0 w-32 h-40 rounded-lg bg-[var(--color-button-bg)] border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 hover:border-[var(--color-brand)] cursor-pointer transition-colors relative group">
                            <Plus className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand)]" size={20} />
                            <span className="text-[10px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand)] font-medium uppercase tracking-wider">add photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newPhotos = [...(friend.photos || [])];
                                        Array.from(e.target.files).forEach(file => {
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                newPhotos.push(reader.result);
                                                handleChange('photos', newPhotos);
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer no longer needed */}

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name - always visible, editable inline */}
                {isEditing ? (
                    <input
                        type="text"
                        value={friend.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Their name"
                        className={`${tactileInputClass} text-xl font-bold focus:ring-0`}
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

                {/* Favorite Memory */}
                {!isEditing && friend.memory && (
                    <div className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Sparkles size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="italic">"{friend.memory}"</span>
                    </div>
                )}

                {/* Notes */}
                {!isEditing && friend.notes && (
                    <div className="pt-2 border-t border-[var(--color-border)] mt-2">
                        <p className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">{friend.notes}</p>
                    </div>
                )}

                {/* Edit Mode Fields */}
                {isEditing && (
                    <div className="space-y-4 pt-2">
                        {/* Nickname */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">nickname</label>
                            <input
                                type="text"
                                placeholder="what do you call them?"
                                value={friend.nickname || ''}
                                onChange={(e) => handleChange('nickname', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>

                        {/* Pronouns + Connection Type Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">pronouns</label>
                                <TactileSelect
                                    value={friend.pronouns}
                                    onChange={(opt) => handleChange('pronouns', opt.code)}
                                    options={PRONOUNS}
                                    placeholder="select..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">connection</label>
                                <select
                                    value={friend.relationshipType || ''}
                                    onChange={(e) => handleChange('relationshipType', e.target.value)}
                                    className={tactileSelectClass}
                                >
                                    <option value="">select...</option>
                                    {RELATIONSHIP_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location Row */}
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
                                        placeholder="select..."
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="city or region"
                                        value={friend.state || ''}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        className={tactileInputClass}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">what they do</label>
                            <input
                                type="text"
                                placeholder="designer at acme, student..."
                                value={friend.role || ''}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>

                        {/* How you met */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">how you met</label>
                            <input
                                type="text"
                                placeholder="at a coffee shop, through a friend..."
                                value={friend.howMet || ''}
                                onChange={(e) => handleChange('howMet', e.target.value)}
                                className={tactileInputClass}
                            />
                        </div>

                        {/* Memory */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">favorite memory</label>
                            <textarea
                                placeholder="that time we..."
                                value={friend.memory || ''}
                                onChange={(e) => handleChange('memory', e.target.value)}
                                className={`${tactileInputClass} resize-none`}
                                rows={2}
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block lowercase">notes</label>
                            <textarea
                                placeholder="extra details..."
                                value={friend.notes || ''}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                className={`${tactileInputClass} resize-none`}
                                rows={3}
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
                                    className="p-1.5 rounded-full transition-all shadow-inner hover:shadow-sm bg-[var(--color-button-bg)] border border-[var(--color-border)] hover:bg-white"
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
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[2px] transition-all ${copied
                                    ? 'bg-green-100 text-green-600 shadow-[inset_0_2px_4px_0_rgba(34,197,94,0.2)]'
                                    : 'bg-[var(--color-button-bg)] hover:text-[var(--color-brand)] text-[var(--color-text-secondary)] shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]'
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
        </div >
    );
}
