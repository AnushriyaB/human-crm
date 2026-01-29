import React from 'react';
import BentoCard from '../Card';
import { Trash2, BookOpen, MapPin, Heart, Target, CloudRain } from 'lucide-react';

export default function StoryCard({ module, isEditing, onUpdate, onRemove, isNew }) {
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
                    <BookOpen size={16} />
                    <h3 className="text-xs font-bold lowercase tracking-wider">story</h3>
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
                <Field
                    icon={MapPin}
                    label="grew up"
                    field="grewUp"
                    placeholder="small town in texas, moved to nyc..."
                />

                <Field
                    icon={Heart}
                    label="values"
                    field="whatMatters"
                    placeholder="family, career, creativity, social justice..."
                    multiline
                />

                <Field
                    icon={Target}
                    label="big goals or dreams"
                    field="goalsAndDreams"
                    placeholder="write a book, travel the world..."
                    multiline
                />

                <Field
                    icon={CloudRain}
                    label="current stresses"
                    field="currentStresses"
                    placeholder="job search, health issues..."
                    multiline
                />
            </div>
        </div>

    );
}
