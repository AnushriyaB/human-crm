import React from 'react';
import BentoCard from '../Card';
import { Sparkles, Utensils, Palette, Music, Gift } from 'lucide-react';

export default function PreferencesCard({ module, isEditing, onUpdate }) {
    const data = module.data || {};
    const favorites = data.favorites || {
        food: '',
        color: '',
        music: '',
        hobbies: '',
        giftIdeas: ''
    };

    const handleChange = (field, value) => {
        onUpdate?.({
            ...data,
            favorites: { ...favorites, [field]: value }
        });
    };

    const inputClass = "w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)]";

    const fields = [
        { key: 'food', label: 'Favorite Food', icon: Utensils, placeholder: 'Pizza, sushi, etc.' },
        { key: 'color', label: 'Favorite Color', icon: Palette, placeholder: 'Blue, green, etc.' },
        { key: 'music', label: 'Music Taste', icon: Music, placeholder: 'Jazz, indie, classical...' },
        { key: 'hobbies', label: 'Hobbies', icon: Sparkles, placeholder: 'Reading, hiking, gaming...' },
        { key: 'giftIdeas', label: 'Gift Ideas', icon: Gift, placeholder: 'Wishlist items...' }
    ];

    return (
        <BentoCard title="Favorites" icon={Sparkles} className="col-span-2">
            <div className="grid grid-cols-2 gap-3">
                {fields.map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key} className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                            <Icon size={12} />
                            <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={favorites[key] || ''}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className={inputClass}
                            />
                        ) : (
                            <div className="text-sm">
                                {favorites[key] || (
                                    <span className="text-[var(--color-text-secondary)] italic text-xs">Not set</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </BentoCard>
    );
}
