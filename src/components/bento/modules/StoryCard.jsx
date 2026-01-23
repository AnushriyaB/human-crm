import React from 'react';
import BentoCard from '../Card';
import { BookOpen, MapPin, Heart, Target, CloudRain } from 'lucide-react';

export default function StoryCard({ module, isEditing, onUpdate, onRemove, isNew }) {
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
            title="Story"
            icon={BookOpen}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
        >
            <div className="space-y-5">
                <Field
                    icon={MapPin}
                    label="Grew Up"
                    field="grewUp"
                    placeholder="Small town in Texas, moved to NYC..."
                />

                <Field
                    icon={Heart}
                    label="Values"
                    field="whatMatters"
                    placeholder="Family, career, creativity, social justice..."
                    multiline
                />

                <Field
                    icon={Target}
                    label="Big Goals or Dreams"
                    field="goalsAndDreams"
                    placeholder="Write a book, travel the world..."
                    multiline
                />

                <Field
                    icon={CloudRain}
                    label="Current Stresses"
                    field="currentStresses"
                    placeholder="Job search, health issues..."
                    multiline
                />
            </div>
        </BentoCard>
    );
}
