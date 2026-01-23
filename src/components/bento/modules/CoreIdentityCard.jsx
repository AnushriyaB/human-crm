import React from 'react';
import BentoCard from '../Card';
import { User, MapPin, Calendar, Gift } from 'lucide-react';

export default function CoreIdentityCard({ friend, isEditing, onUpdate }) {
    const handleBirthdayChange = (e) => {
        onUpdate?.({ birthday: e.target.value });
    };

    const handleLocationChange = (e) => {
        onUpdate?.({ location: e.target.value });
    };

    const inputClass = "px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)]";

    // Calculate age from birthday
    const getAge = (birthday) => {
        if (!birthday) return null;
        const today = new Date();
        const birth = new Date(birthday);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Calculate days until birthday
    const getDaysUntilBirthday = (birthday) => {
        if (!birthday) return null;
        const today = new Date();
        const birth = new Date(birthday);
        birth.setFullYear(today.getFullYear());
        if (birth < today) {
            birth.setFullYear(today.getFullYear() + 1);
        }
        const diff = birth - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const age = getAge(friend.birthday);
    const daysUntil = getDaysUntilBirthday(friend.birthday);

    return (
        <BentoCard
            title="Identity"
            icon={User}
            className="row-span-1 md:col-span-2"
        >
            <div className="flex items-start gap-4">
                {/* Large Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center overflow-hidden shrink-0 border border-[var(--color-border)]">
                    {friend.photo ? (
                        <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold opacity-30">{friend.name.charAt(0)}</span>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">{friend.name}</h2>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <MapPin size={14} />
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="Location"
                                value={friend.location || ''}
                                onChange={handleLocationChange}
                                className={`${inputClass} w-40`}
                            />
                        ) : (
                            <span className="text-sm">{friend.location || 'Nomad'}</span>
                        )}
                    </div>

                    {/* Birthday */}
                    <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <Gift size={14} />
                        {isEditing ? (
                            <input
                                type="date"
                                value={friend.birthday || ''}
                                onChange={handleBirthdayChange}
                                className={`${inputClass} w-40`}
                            />
                        ) : friend.birthday ? (
                            <span className="text-sm">
                                {new Date(friend.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                {age !== null && <span className="opacity-60"> · {age} yrs</span>}
                                {daysUntil !== null && daysUntil <= 30 && (
                                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                                        🎂 {daysUntil}d
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span className="text-sm italic opacity-50">No birthday set</span>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mt-3">
                        <span className="px-2 py-1 bg-[var(--color-bg-secondary)] rounded-md text-xs font-medium">Friend</span>
                        {friend.isMe && (
                            <span className="px-2 py-1 bg-[var(--color-brand)]/10 text-[var(--color-brand)] rounded-md text-xs font-medium">You</span>
                        )}
                    </div>

                    {/* Passkey (shown until they join) */}
                    {friend.passphrase && !friend.hasJoined && (
                        <div className="mt-2 text-xs">
                            <span className="text-[var(--color-text-secondary)]">Passkey: </span>
                            <span className="font-mono text-[var(--color-brand)]">{friend.passphrase}</span>
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
