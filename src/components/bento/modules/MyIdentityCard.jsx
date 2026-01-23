import React, { useState, useRef } from 'react';
import BentoCard from '../Card';
import { User, MapPin, Globe, Briefcase, Heart, Camera, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useFriends } from '../../../context/FriendContext';

const PRONOUNS = [
    { label: 'he/him', value: 'he/him' },
    { label: 'she/her', value: 'she/her' },
    { label: 'they/them', value: 'they/them' },
    { label: 'other', value: 'other' }
];

export default function MyIdentityCard({ friend, isEditing, onUpdate }) {
    const { geocodeFriendLocation } = useFriends();
    const fileInputRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [showPasskey, setShowPasskey] = useState(false);

    const handleChange = (field, value) => {
        onUpdate?.({ [field]: value });
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

                {/* Location & Timezone */}
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>Location</label>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="City, Country"
                                value={friend.location || ''}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className={inputClass}
                            />
                        ) : (
                            <p className="text-sm font-medium">{friend.location || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>Timezone</label>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="PST, EST, etc."
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
