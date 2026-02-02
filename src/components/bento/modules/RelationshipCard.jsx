import React from 'react';
import BentoCard from '../Card';
import { Handshake, Clock, Phone, MessageCircle, Sparkles, Heart } from 'lucide-react';
import TactileSelect from '../../ui/TactileSelect';

const CHECK_IN_OPTIONS = [
    { value: 'weekly', label: 'weekly' },
    { value: 'biweekly', label: 'every 2 weeks' },
    { value: 'monthly', label: 'monthly' },
    { value: 'quarterly', label: 'every 3 months' },
    { value: 'biannual', label: 'twice a year' },
    { value: 'yearly', label: 'yearly' },
    { value: 'as_needed', label: 'as needed' }
];

const CONFLICT_STYLES = [
    { value: 'direct', label: 'direct & confrontational' },
    { value: 'avoidant', label: 'avoids conflict' },
    { value: 'passive', label: 'passive-aggressive' },
    { value: 'calm', label: 'calm & logical' },
    { value: 'emotional', label: 'emotional & expressive' },
    { value: 'mediator', label: 'seeks mediation' },
    { value: 'unknown', label: 'not sure yet' }
];

export default function RelationshipCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};

    const howMet = data.howMet || '';
    const memory = data.memory || '';
    const notes = data.notes || '';
    const lastMet = data.lastMet || '';
    const lastContacted = data.lastContacted || '';
    const checkInFrequency = data.checkInFrequency || '';
    const whatTheyreIntoNow = data.whatTheyreIntoNow || '';
    const whatTheyreProudOf = data.whatTheyreProudOf || '';
    const howTheyHandleConflict = data.howTheyHandleConflict || '';

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const getDaysSince = (dateStr) => {
        if (!dateStr) return null;
        const today = new Date();
        const target = new Date(dateStr);
        return Math.floor((today - target) / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const inputClass = `w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400`;

    const textareaClass = `${inputClass} min-h-[80px] resize-none`;

    const labelClass = "text-xs font-medium lowercase text-[var(--color-text-secondary)] mb-1.5 block";

    // Group header component per Phase 4 visual hierarchy
    const GroupHeader = ({ icon: Icon, label }) => (
        <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-5 mt-5 first:border-0 first:pt-0 first:mt-0 pb-3">
            <Icon size={14} className="text-[var(--color-text-secondary)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                {label}
            </span>
        </div>
    );

    return (
        <BentoCard
            title="relationship"
            icon={Handshake}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
        >
            <div className="space-y-1">
                {/* YOUR BOND */}
                <GroupHeader icon={Heart} label="YOUR BOND" />

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>how you met</label>
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="e.g. college roommate, work, mutual friend..."
                                value={howMet}
                                onChange={(e) => updateData({ howMet: e.target.value })}
                                className={inputClass}
                            />
                        ) : (
                            <p className="text-sm">{howMet || <span className="text-[var(--color-text-tertiary)] italic">not set</span>}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>a favorite memory together</label>
                        {isEditing ? (
                            <textarea
                                placeholder="that time you..."
                                value={memory}
                                onChange={(e) => updateData({ memory: e.target.value })}
                                className={textareaClass}
                            />
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">{memory || <span className="text-[var(--color-text-tertiary)] italic">not set</span>}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>notes about them</label>
                        {isEditing ? (
                            <textarea
                                placeholder="things to remember, inside jokes, topics to avoid..."
                                value={notes}
                                onChange={(e) => updateData({ notes: e.target.value })}
                                className={textareaClass}
                            />
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">{notes || <span className="text-[var(--color-text-tertiary)] italic">not set</span>}</p>
                        )}
                    </div>
                </div>

                {/* KEEPING IN TOUCH */}
                <GroupHeader icon={Phone} label="KEEPING IN TOUCH" />

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>last met in person</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={lastMet}
                                    onChange={(e) => updateData({ lastMet: e.target.value })}
                                    className={inputClass}
                                />
                            ) : lastMet ? (
                                <p className="text-sm">
                                    <span className="font-medium">{formatDate(lastMet)}</span>
                                    <span className="text-[var(--color-text-secondary)] ml-1">· {getDaysSince(lastMet)}d ago</span>
                                </p>
                            ) : (
                                <p className="text-sm text-[var(--color-text-tertiary)] italic">not set</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>last called/texted</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={lastContacted}
                                    onChange={(e) => updateData({ lastContacted: e.target.value })}
                                    className={inputClass}
                                />
                            ) : lastContacted ? (
                                <p className="text-sm">
                                    <span className="font-medium">{formatDate(lastContacted)}</span>
                                    <span className="text-[var(--color-text-secondary)] ml-1">· {getDaysSince(lastContacted)}d ago</span>
                                </p>
                            ) : (
                                <p className="text-sm text-[var(--color-text-tertiary)] italic">not set</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>check-in frequency</label>
                        {isEditing ? (
                            <TactileSelect
                                value={checkInFrequency}
                                onChange={(v) => updateData({ checkInFrequency: v })}
                                options={CHECK_IN_OPTIONS}
                                placeholder="how often to reach out"
                            />
                        ) : (
                            <p className="text-sm">
                                {CHECK_IN_OPTIONS.find(o => o.value === checkInFrequency)?.label ||
                                    <span className="text-[var(--color-text-tertiary)] italic">not set</span>}
                            </p>
                        )}
                    </div>
                </div>

                {/* LIVING & CHANGING */}
                <GroupHeader icon={Sparkles} label="LIVING & CHANGING" />

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>what they're into right now</label>
                        {isEditing ? (
                            <textarea
                                placeholder="new hobbies, interests, projects they're excited about..."
                                value={whatTheyreIntoNow}
                                onChange={(e) => updateData({ whatTheyreIntoNow: e.target.value })}
                                className={textareaClass}
                            />
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">{whatTheyreIntoNow || <span className="text-[var(--color-text-tertiary)] italic">not set</span>}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>what they're proud of lately</label>
                        {isEditing ? (
                            <textarea
                                placeholder="recent wins, accomplishments..."
                                value={whatTheyreProudOf}
                                onChange={(e) => updateData({ whatTheyreProudOf: e.target.value })}
                                className={textareaClass}
                            />
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">{whatTheyreProudOf || <span className="text-[var(--color-text-tertiary)] italic">not set</span>}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>how they handle conflict</label>
                        {isEditing ? (
                            <TactileSelect
                                value={howTheyHandleConflict}
                                onChange={(v) => updateData({ howTheyHandleConflict: v })}
                                options={CONFLICT_STYLES}
                                placeholder="their conflict style"
                            />
                        ) : (
                            <p className="text-sm">
                                {CONFLICT_STYLES.find(o => o.value === howTheyHandleConflict)?.label ||
                                    <span className="text-[var(--color-text-tertiary)] italic">not set</span>}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </BentoCard>
    );
}
