import React from 'react';
import BentoCard from '../Card';
import { Sparkles, Utensils, Wine, Music, Gamepad2, Gift, Ban } from 'lucide-react';

export default function FavoritesCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const inputClass = "px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] w-full";
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = "text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block";

    const Field = ({ icon: Icon, label, field, placeholder, multiline }) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-[var(--color-text-secondary)]" />
                <label className={labelClass.replace(' mb-2 block', '')}>{label}</label>
            </div>
            {isEditing ? (
                multiline ? (
                    <textarea
                        placeholder={placeholder}
                        value={data[field] || ''}
                        onChange={(e) => updateData({ [field]: e.target.value })}
                        className={textareaClass}
                        rows={2}
                    />
                ) : (
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={data[field] || ''}
                        onChange={(e) => updateData({ [field]: e.target.value })}
                        className={inputClass}
                    />
                )
            ) : (
                <p className="text-sm">{data[field] || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
            )}
        </div>
    );

    return (
        <BentoCard
            title="Favorites"
            icon={Sparkles}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
        >
            <div className="space-y-5">
                {/* Food Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Utensils} label="Loves to Eat" field="foodLikes" placeholder="Pizza, sushi, Thai..." />
                    <Field icon={Ban} label="Avoids / Allergies" field="foodAvoids" placeholder="Shellfish, gluten..." />
                </div>

                {/* Drinks */}
                <Field
                    icon={Wine}
                    label="Drinks"
                    field="drinks"
                    placeholder="Oat milk latte, green tea, red wine, 'doesn't drink'..."
                />

                {/* Media */}
                <Field
                    icon={Music}
                    label="Music, Shows, Books, Games"
                    field="media"
                    placeholder="Jazz, Breaking Bad, sci-fi novels, chess..."
                    multiline
                />

                {/* Hobbies */}
                <Field
                    icon={Gamepad2}
                    label="Hobbies"
                    field="hobbies"
                    placeholder="Hiking, photography, cooking..."
                />

                {/* Gifts Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Gift} label="Gift Ideas" field="giftIdeas" placeholder="Wishlist items..." />
                    <Field icon={Ban} label="Never Gift" field="neverGift" placeholder="Candles, socks..." />
                </div>
            </div>
        </BentoCard>
    );
}
