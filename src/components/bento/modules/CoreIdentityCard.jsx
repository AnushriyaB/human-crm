import React, { useRef } from 'react';
import { Handshake, Sparkles, MapPin, Briefcase, Camera, ImagePlus } from 'lucide-react';
import TactileSelect from '../../ui/TactileSelect';
import { useFriends } from '../../../context/FriendContext';
import { COUNTRIES, getSubdivisions, getSubdivisionLabel, getCountryTimezone } from '../../../data/countryData';

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

    const handleChange = (field, value) => {
        onUpdate?.({ [field]: value });
    };

    const handleCountryChange = (country) => {
        const countryTz = getCountryTimezone(country.code || country.name);

        const updates = {
            country: country.name,
            state: '',
            location: country.name,
        };

        if (countryTz) {
            updates.timezone = countryTz;
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

    // Get subdivisions for the selected country
    const subdivisions = getSubdivisions(friend.country);
    const subdivisionLabel = getSubdivisionLabel(friend.country);

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

    // Build location string
    const locationString = [friend.state, friend.country].filter(Boolean).join(', ');

    return (
        <div className="space-y-6">
            {/* Cover Image & Avatar container */}
            <div className="relative mb-20">
                {/* Cover Image */}
                <div className="relative w-full overflow-hidden rounded-[4px]" style={{ height: '180px' }}>
                    {/* Glass Frame Background */}
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
                                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all shadow-lg hover:shadow-xl"
                                title="Change cover photo"
                            >
                                <ImagePlus size={18} />
                            </button>
                        </>
                    )}
                </div>

                {/* Avatar - positioned absolutely, overlapping bottom of cover */}
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
                                    {subdivisionLabel}
                                </label>
                                {subdivisions ? (
                                    <TactileSelect
                                        value={friend.state}
                                        onChange={handleStateChange}
                                        options={subdivisions}
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

            </div>
        </div >
    );
}
