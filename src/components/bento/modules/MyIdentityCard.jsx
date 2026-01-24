import React, { useState, useRef, useMemo } from 'react';
import BentoCard from '../Card';
import { User, MapPin, Globe, Briefcase, Heart, Camera, Copy, Check, Eye, EyeOff, ChevronDown, Search } from 'lucide-react';
import { useFriends } from '../../../context/FriendContext';

const PRONOUNS = [
    { label: 'he/him', value: 'he/him' },
    { label: 'she/her', value: 'she/her' },
    { label: 'they/them', value: 'they/them' },
    { label: 'other', value: 'other' }
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
    { name: 'Hong Kong', code: 'HK', tz: 'HKT (UTC+8)' },
    { name: 'Taiwan', code: 'TW', tz: 'CST (UTC+8)' },
    { name: 'New Zealand', code: 'NZ', tz: 'NZST (UTC+12)' },
    { name: 'Ireland', code: 'IE', tz: 'GMT (UTC+0)' },
    { name: 'Sweden', code: 'SE', tz: 'CET (UTC+1)' },
    { name: 'Switzerland', code: 'CH', tz: 'CET (UTC+1)' },
    { name: 'Austria', code: 'AT', tz: 'CET (UTC+1)' },
    { name: 'Belgium', code: 'BE', tz: 'CET (UTC+1)' },
    { name: 'Portugal', code: 'PT', tz: 'WET (UTC+0)' },
    { name: 'Poland', code: 'PL', tz: 'CET (UTC+1)' },
    { name: 'Norway', code: 'NO', tz: 'CET (UTC+1)' },
    { name: 'Denmark', code: 'DK', tz: 'CET (UTC+1)' },
    { name: 'Finland', code: 'FI', tz: 'EET (UTC+2)' },
    { name: 'Israel', code: 'IL', tz: 'IST (UTC+2)' },
    { name: 'UAE', code: 'AE', tz: 'GST (UTC+4)' },
    { name: 'South Africa', code: 'ZA', tz: 'SAST (UTC+2)' },
    { name: 'Argentina', code: 'AR', tz: 'ART (UTC-3)' },
    { name: 'Chile', code: 'CL', tz: 'CLT (UTC-4)' },
    { name: 'Colombia', code: 'CO', tz: 'COT (UTC-5)' },
    { name: 'Thailand', code: 'TH', tz: 'ICT (UTC+7)' },
    { name: 'Vietnam', code: 'VN', tz: 'ICT (UTC+7)' },
    { name: 'Philippines', code: 'PH', tz: 'PHT (UTC+8)' },
    { name: 'Indonesia', code: 'ID', tz: 'Multiple' },
    { name: 'Malaysia', code: 'MY', tz: 'MYT (UTC+8)' },
    { name: 'Russia', code: 'RU', tz: 'Multiple' },
    { name: 'Ukraine', code: 'UA', tz: 'EET (UTC+2)' },
    { name: 'Czech Republic', code: 'CZ', tz: 'CET (UTC+1)' },
    { name: 'Greece', code: 'GR', tz: 'EET (UTC+2)' },
    { name: 'Turkey', code: 'TR', tz: 'TRT (UTC+3)' },
    { name: 'Egypt', code: 'EG', tz: 'EET (UTC+2)' },
    { name: 'Nigeria', code: 'NG', tz: 'WAT (UTC+1)' },
    { name: 'Kenya', code: 'KE', tz: 'EAT (UTC+3)' },
    { name: 'Pakistan', code: 'PK', tz: 'PKT (UTC+5)' },
    { name: 'Bangladesh', code: 'BD', tz: 'BST (UTC+6)' },
];

// US States with timezones
const US_STATES = [
    { name: 'Alabama', code: 'AL', tz: 'CST (UTC-6)' },
    { name: 'Alaska', code: 'AK', tz: 'AKST (UTC-9)' },
    { name: 'Arizona', code: 'AZ', tz: 'MST (UTC-7)' },
    { name: 'Arkansas', code: 'AR', tz: 'CST (UTC-6)' },
    { name: 'California', code: 'CA', tz: 'PST (UTC-8)' },
    { name: 'Colorado', code: 'CO', tz: 'MST (UTC-7)' },
    { name: 'Connecticut', code: 'CT', tz: 'EST (UTC-5)' },
    { name: 'Delaware', code: 'DE', tz: 'EST (UTC-5)' },
    { name: 'Florida', code: 'FL', tz: 'EST (UTC-5)' },
    { name: 'Georgia', code: 'GA', tz: 'EST (UTC-5)' },
    { name: 'Hawaii', code: 'HI', tz: 'HST (UTC-10)' },
    { name: 'Idaho', code: 'ID', tz: 'MST (UTC-7)' },
    { name: 'Illinois', code: 'IL', tz: 'CST (UTC-6)' },
    { name: 'Indiana', code: 'IN', tz: 'EST (UTC-5)' },
    { name: 'Iowa', code: 'IA', tz: 'CST (UTC-6)' },
    { name: 'Kansas', code: 'KS', tz: 'CST (UTC-6)' },
    { name: 'Kentucky', code: 'KY', tz: 'EST (UTC-5)' },
    { name: 'Louisiana', code: 'LA', tz: 'CST (UTC-6)' },
    { name: 'Maine', code: 'ME', tz: 'EST (UTC-5)' },
    { name: 'Maryland', code: 'MD', tz: 'EST (UTC-5)' },
    { name: 'Massachusetts', code: 'MA', tz: 'EST (UTC-5)' },
    { name: 'Michigan', code: 'MI', tz: 'EST (UTC-5)' },
    { name: 'Minnesota', code: 'MN', tz: 'CST (UTC-6)' },
    { name: 'Mississippi', code: 'MS', tz: 'CST (UTC-6)' },
    { name: 'Missouri', code: 'MO', tz: 'CST (UTC-6)' },
    { name: 'Montana', code: 'MT', tz: 'MST (UTC-7)' },
    { name: 'Nebraska', code: 'NE', tz: 'CST (UTC-6)' },
    { name: 'Nevada', code: 'NV', tz: 'PST (UTC-8)' },
    { name: 'New Hampshire', code: 'NH', tz: 'EST (UTC-5)' },
    { name: 'New Jersey', code: 'NJ', tz: 'EST (UTC-5)' },
    { name: 'New Mexico', code: 'NM', tz: 'MST (UTC-7)' },
    { name: 'New York', code: 'NY', tz: 'EST (UTC-5)' },
    { name: 'North Carolina', code: 'NC', tz: 'EST (UTC-5)' },
    { name: 'North Dakota', code: 'ND', tz: 'CST (UTC-6)' },
    { name: 'Ohio', code: 'OH', tz: 'EST (UTC-5)' },
    { name: 'Oklahoma', code: 'OK', tz: 'CST (UTC-6)' },
    { name: 'Oregon', code: 'OR', tz: 'PST (UTC-8)' },
    { name: 'Pennsylvania', code: 'PA', tz: 'EST (UTC-5)' },
    { name: 'Rhode Island', code: 'RI', tz: 'EST (UTC-5)' },
    { name: 'South Carolina', code: 'SC', tz: 'EST (UTC-5)' },
    { name: 'South Dakota', code: 'SD', tz: 'CST (UTC-6)' },
    { name: 'Tennessee', code: 'TN', tz: 'CST (UTC-6)' },
    { name: 'Texas', code: 'TX', tz: 'CST (UTC-6)' },
    { name: 'Utah', code: 'UT', tz: 'MST (UTC-7)' },
    { name: 'Vermont', code: 'VT', tz: 'EST (UTC-5)' },
    { name: 'Virginia', code: 'VA', tz: 'EST (UTC-5)' },
    { name: 'Washington', code: 'WA', tz: 'PST (UTC-8)' },
    { name: 'West Virginia', code: 'WV', tz: 'EST (UTC-5)' },
    { name: 'Wisconsin', code: 'WI', tz: 'CST (UTC-6)' },
    { name: 'Wyoming', code: 'WY', tz: 'MST (UTC-7)' },
    { name: 'Washington D.C.', code: 'DC', tz: 'EST (UTC-5)' },
];

// Canadian provinces
const CA_PROVINCES = [
    { name: 'Ontario', code: 'ON', tz: 'EST (UTC-5)' },
    { name: 'Quebec', code: 'QC', tz: 'EST (UTC-5)' },
    { name: 'British Columbia', code: 'BC', tz: 'PST (UTC-8)' },
    { name: 'Alberta', code: 'AB', tz: 'MST (UTC-7)' },
    { name: 'Manitoba', code: 'MB', tz: 'CST (UTC-6)' },
    { name: 'Saskatchewan', code: 'SK', tz: 'CST (UTC-6)' },
    { name: 'Nova Scotia', code: 'NS', tz: 'AST (UTC-4)' },
    { name: 'New Brunswick', code: 'NB', tz: 'AST (UTC-4)' },
    { name: 'Newfoundland', code: 'NL', tz: 'NST (UTC-3:30)' },
    { name: 'Prince Edward Island', code: 'PE', tz: 'AST (UTC-4)' },
];

// Australian states
const AU_STATES = [
    { name: 'New South Wales', code: 'NSW', tz: 'AEST (UTC+10)' },
    { name: 'Victoria', code: 'VIC', tz: 'AEST (UTC+10)' },
    { name: 'Queensland', code: 'QLD', tz: 'AEST (UTC+10)' },
    { name: 'Western Australia', code: 'WA', tz: 'AWST (UTC+8)' },
    { name: 'South Australia', code: 'SA', tz: 'ACST (UTC+9:30)' },
    { name: 'Tasmania', code: 'TAS', tz: 'AEST (UTC+10)' },
];

function SearchableSelect({ value, onChange, options, placeholder }) {
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] text-left flex items-center justify-between"
            >
                <span className={selectedOption ? '' : 'text-gray-400'}>
                    {selectedOption?.name || placeholder}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-[var(--color-border)] rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-[var(--color-border)]">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 text-sm rounded border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-brand)]"
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
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] ${selectedOption?.code === opt.code ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : ''
                                        }`}
                                >
                                    {opt.name}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-400">No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MyIdentityCard({ friend, isEditing, onUpdate }) {
    const { geocodeFriendLocation } = useFriends();
    const fileInputRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [showPasskey, setShowPasskey] = useState(false);

    const handleChange = (field, value) => {
        onUpdate?.({ [field]: value });
    };

    const handleCountryChange = (country) => {
        const updates = {
            country: country.name,
            state: '', // Reset state when country changes
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

    const inputClass = "px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] w-full";
    const selectClass = "px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)]";
    const labelClass = "text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block";

    return (
        <BentoCard
            title="My Identity"
            icon={User}
            className="row-span-1 md:col-span-2"
        >
            <div className="space-y-6">
                {/* Top Row: Avatar + Name + Bio */}
                <div className="flex items-start gap-5">
                    {/* Avatar with upload overlay in edit mode */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-lg">
                            {friend.photo ? (
                                <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-white">{(friend.name || '?').charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        {/* Photo upload overlay - only in edit mode */}
                        {isEditing && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera size={24} className="text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Name - editable */}
                        <div>
                            <label className={labelClass}>Display Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={friend.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`${inputClass} text-xl font-bold`}
                                />
                            ) : (
                                <h2 className="text-2xl font-bold tracking-tight">{friend.name || 'Unnamed'}</h2>
                            )}
                        </div>

                        {/* Pronouns */}
                        <div>
                            <label className={labelClass}>Pronouns</label>
                            {isEditing ? (
                                <select
                                    value={friend.pronouns || ''}
                                    onChange={(e) => handleChange('pronouns', e.target.value)}
                                    className={`${selectClass} w-full`}
                                >
                                    <option value="">Select pronouns...</option>
                                    {PRONOUNS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm font-medium">{friend.pronouns || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio/About Me */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Heart size={14} className="text-[var(--color-text-secondary)]" />
                        <label className={labelClass.replace(' mb-2 block', '')}>About Me</label>
                    </div>
                    {isEditing ? (
                        <textarea
                            placeholder="A short bio about yourself..."
                            value={friend.bio || ''}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            className={`${inputClass} resize-none`}
                            rows={3}
                        />
                    ) : (
                        <p className="text-sm">{friend.bio || <span className="text-[var(--color-text-secondary)] italic">Tell others about yourself...</span>}</p>
                    )}
                </div>

                {/* Location Row */}
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>Country</label>
                        </div>
                        {isEditing ? (
                            <SearchableSelect
                                value={friend.country}
                                onChange={handleCountryChange}
                                options={COUNTRIES}
                                placeholder="Select country..."
                            />
                        ) : (
                            <p className="text-sm font-medium">{friend.country || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>
                                {friend.country === 'Canada' ? 'Province' : 'State'}
                            </label>
                        </div>
                        {isEditing ? (
                            states ? (
                                <SearchableSelect
                                    value={friend.state}
                                    onChange={handleStateChange}
                                    options={states}
                                    placeholder={`Select ${friend.country === 'Canada' ? 'province' : 'state'}...`}
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder="City or region"
                                    value={friend.state || ''}
                                    onChange={(e) => handleChange('state', e.target.value)}
                                    className={inputClass}
                                />
                            )
                        ) : (
                            <p className="text-sm font-medium">{friend.state || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                        )}
                    </div>
                </div>

                {/* Timezone Row */}
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>Timezone</label>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="Auto-filled from location"
                                value={friend.timezone || ''}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                className={inputClass}
                            />
                        ) : (
                            <p className="text-sm font-medium">{friend.timezone || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                        )}
                    </div>
                </div>

                {/* Current Role/What I Do */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Briefcase size={14} className="text-[var(--color-text-secondary)]" />
                        <label className={labelClass.replace(' mb-2 block', '')}>What I Do</label>
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            placeholder="Designer at Acme, Student, Entrepreneur..."
                            value={friend.currentRole || ''}
                            onChange={(e) => handleChange('currentRole', e.target.value)}
                            className={inputClass}
                        />
                    ) : (
                        <p className="text-sm font-medium">{friend.currentRole || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                    )}
                </div>

                {/* Passkey - Secret with click to copy */}
                {friend.passphrase && (
                    <div className="pt-4 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-secondary)] mb-2">Share this passkey with friends so they can find you:</p>
                        <div className="flex items-center justify-between bg-[var(--color-bg-secondary)] rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-[var(--color-brand)]">
                                    {showPasskey ? friend.passphrase : maskPasskey(friend.passphrase)}
                                </span>
                                <button
                                    onClick={() => setShowPasskey(!showPasskey)}
                                    className="p-1 hover:bg-white rounded transition-colors"
                                    title={showPasskey ? "Hide passkey" : "Show passkey"}
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
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                                    transition-all duration-200
                                    ${copied
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-white hover:bg-[var(--color-brand)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] border border-[var(--color-border)]'
                                    }
                                `}
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
        </BentoCard>
    );
}
