import React from 'react';
import BentoCard from '../Card';
import { BookOpen, MapPin, Sparkles } from 'lucide-react';

export default function MemoriesCard({ module, isEditing, onUpdate }) {
    const data = module.data || {};
    const howWeMet = data.howWeMet || '';
    const favoriteMemory = data.favoriteMemory || '';
    const firstMeeting = data.firstMeeting || '';
    const notes = data.notes || '';

    const handleChange = (field, value) => {
        onUpdate?.({ ...data, [field]: value });
    };

    const inputClass = "w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)]";
    const textareaClass = "w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)] resize-none";

    return (
        <BentoCard title="Our Story" icon={BookOpen} className="col-span-2">
            <div className="space-y-4">
                {/* How We Met */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <MapPin size={12} />
                        <span className="text-[10px] font-medium uppercase tracking-wide">How We Met</span>
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            placeholder="At a coffee shop, through friends, at work..."
                            value={howWeMet}
                            onChange={(e) => handleChange('howWeMet', e.target.value)}
                            className={inputClass}
                        />
                    ) : (
                        <div className="text-sm">
                            {howWeMet || (
                                <span className="text-[var(--color-text-secondary)] italic text-xs">Not set</span>
                            )}
                        </div>
                    )}
                </div>

                {/* First Meeting Date */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <Sparkles size={12} />
                        <span className="text-[10px] font-medium uppercase tracking-wide">First Meeting</span>
                    </div>
                    {isEditing ? (
                        <input
                            type="date"
                            value={firstMeeting}
                            onChange={(e) => handleChange('firstMeeting', e.target.value)}
                            className={inputClass}
                        />
                    ) : (
                        <div className="text-sm">
                            {firstMeeting ? (
                                new Date(firstMeeting).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            ) : (
                                <span className="text-[var(--color-text-secondary)] italic text-xs">Not set</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Favorite Memory */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <BookOpen size={12} />
                        <span className="text-[10px] font-medium uppercase tracking-wide">Favorite Memory</span>
                    </div>
                    {isEditing ? (
                        <textarea
                            placeholder="That time we..."
                            value={favoriteMemory}
                            onChange={(e) => handleChange('favoriteMemory', e.target.value)}
                            className={textareaClass}
                            rows={2}
                        />
                    ) : (
                        <div className="text-sm">
                            {favoriteMemory || (
                                <span className="text-[var(--color-text-secondary)] italic text-xs">Not set</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="space-y-1">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">Notes</span>
                    {isEditing ? (
                        <textarea
                            placeholder="Anything else to remember..."
                            value={notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            className={textareaClass}
                            rows={2}
                        />
                    ) : (
                        <div className="text-sm">
                            {notes || (
                                <span className="text-[var(--color-text-secondary)] italic text-xs">Not set</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
