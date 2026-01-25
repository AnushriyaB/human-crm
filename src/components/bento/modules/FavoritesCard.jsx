import React from 'react';
import BentoCard from '../Card';
import { Trash2, Sparkles, Utensils, Wine, Music, Gamepad2, Gift, Ban, Coffee, Plane, Heart, Sun } from 'lucide-react';

export default function FavoritesCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const inputClass = `w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400`;
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = "text-xs font-semibold lowercase tracking-wider text-[var(--color-text-secondary)] mb-2 block";

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
        <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Sparkles size={16} />
                    <h3 className="text-xs font-bold lowercase tracking-wider">favorites</h3>
                </div>
                {isEditing && onRemove && (
                    <button
                        onClick={onRemove}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                        title="Remove tile"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
            <div className="space-y-5">
                {/* Coffee/Drink Order - High Priority */}
                <Field
                    icon={Coffee}
                    label="coffee / drink order"
                    field="coffeeOrder"
                    placeholder="oat flat white, extra hot..."
                />

                {/* Food Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Utensils} label="loves to eat" field="foodLikes" placeholder="pizza, sushi..." />
                    <Field icon={Ban} label="avoids / allergies" field="foodAvoids" placeholder="gluten, peanuts..." />
                </div>

                {/* Alcohol / Drinks */}
                <Field
                    icon={Wine}
                    label="alcohol / bar order"
                    field="drinks"
                    placeholder="tequila soda, red wine, doesn't drink..."
                />

                {/* Love Language & Weekends */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Heart} label="love language" field="loveLanguage" placeholder="words of affirmation..." />
                    <Field icon={Sun} label="weekend vibe" field="weekendVibe" placeholder="hiking vs sleeping in..." />
                </div>

                {/* Travel */}
                <Field
                    icon={Plane}
                    label="travel style"
                    field="travelStyle"
                    placeholder="resorts, backpacking, city breaks..."
                />

                {/* Media */}
                <Field
                    icon={Music}
                    label="music, shows, books"
                    field="media"
                    placeholder="jazz, sci-fi novels, breaking bad..."
                    multiline
                />

                {/* Hobbies */}
                <Field
                    icon={Gamepad2}
                    label="hobbies & interests"
                    field="hobbies"
                    placeholder="photography, cooking, climbing..."
                    multiline
                />

                {/* Gifts Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Gift} label="gift ideas" field="giftIdeas" placeholder="wishlist items..." />
                    <Field icon={Ban} label="never gift" field="neverGift" placeholder="candles, socks..." />
                </div>

                {/* Clothing Sizes */}
                <div className="grid grid-cols-3 gap-3">
                    <Field icon={Gift} label="shirt size" field="sizeShirt" placeholder="M, L..." />
                    <Field icon={Gift} label="shoe size" field="sizeShoe" placeholder="10..." />
                    <Field icon={Gift} label="ring size" field="sizeRing" placeholder="7..." />
                </div>
            </div>
        </div>

    );
}
