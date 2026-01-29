import React from 'react';
import BentoCard from '../Card';
import { CalendarDays, Gift, Heart, Clock, Phone, Plus, X } from 'lucide-react';

const DATE_TYPES = [
    { value: 'birthday', label: '🎂 Birthday' },
    { value: 'anniversary', label: '💍 Anniversary' },
    { value: 'move', label: '🏠 Move' },
    { value: 'job', label: '💼 New Job' },
    { value: 'breakup', label: '💔 Breakup' },
    { value: 'illness', label: '🏥 Illness' },
    { value: 'graduation', label: '🎓 Graduation' },
    { value: 'other', label: '📅 Other' }
];

export default function TimelineCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};
    const birthday = data.birthday || '';
    const anniversary = data.anniversary || '';
    const importantDates = data.importantDates || [];
    const lastMet = data.lastMet || '';
    const lastContacted = data.lastContacted || '';

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const addDate = () => updateData({
        importantDates: [...importantDates, { label: '', date: '', type: 'other' }]
    });
    const updateDate = (i, field, value) => {
        const updated = [...importantDates];
        updated[i] = { ...updated[i], [field]: value };
        updateData({ importantDates: updated });
    };
    const removeDate = (i) => updateData({
        importantDates: importantDates.filter((_, idx) => idx !== i)
    });

    const getDaysUntil = (dateStr) => {
        if (!dateStr) return null;
        const today = new Date();
        const target = new Date(dateStr);
        target.setFullYear(today.getFullYear());
        if (target < today) target.setFullYear(today.getFullYear() + 1);
        return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
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
    const labelClass = "text-xs font-semibold lowercase tracking-wider text-[var(--color-text-secondary)] mb-2 block";

    const Field = ({ icon: Icon, label, children }) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-[var(--color-text-secondary)]" />
                <label className={labelClass.replace(' mb-2 block', '')}>{label}</label>
            </div>
            {children}
        </div>
    );

    return (
        <BentoCard
            title="timeline"
            icon={CalendarDays}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
        >
            <div className="space-y-6">
                {/* Key Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Gift} label="birthday">
                        {isEditing ? (
                            <input
                                type="date"
                                value={birthday}
                                onChange={(e) => updateData({ birthday: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : birthday ? (
                            <p className="text-sm font-medium">
                                {formatDate(birthday)}
                                {getDaysUntil(birthday) <= 30 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                        {getDaysUntil(birthday)}d away
                                    </span>
                                )}
                            </p>
                        ) : (
                            <p className="text-sm text-[var(--color-text-secondary)] italic">Not set</p>
                        )}
                    </Field>

                    <Field icon={Heart} label="anniversary">
                        {isEditing ? (
                            <input
                                type="date"
                                value={anniversary}
                                onChange={(e) => updateData({ anniversary: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : anniversary ? (
                            <p className="text-sm font-medium">{formatDate(anniversary)}</p>
                        ) : (
                            <p className="text-sm text-[var(--color-text-secondary)] italic">Not set</p>
                        )}
                    </Field>
                </div>

                {/* Last Contact */}
                <div className="grid grid-cols-2 gap-4">
                    <Field icon={Clock} label="last met">
                        {isEditing ? (
                            <input
                                type="date"
                                value={lastMet}
                                onChange={(e) => updateData({ lastMet: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : lastMet ? (
                            <p className="text-sm">
                                <span className="font-medium">{formatDate(lastMet)}</span>
                                <span className="text-[var(--color-text-secondary)]"> · {getDaysSince(lastMet)}d ago</span>
                            </p>
                        ) : (
                            <p className="text-sm text-[var(--color-text-secondary)] italic">Not set</p>
                        )}
                    </Field>

                    <Field icon={Phone} label="last called/texted">
                        {isEditing ? (
                            <input
                                type="date"
                                value={lastContacted}
                                onChange={(e) => updateData({ lastContacted: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : lastContacted ? (
                            <p className="text-sm">
                                <span className="font-medium">{formatDate(lastContacted)}</span>
                                <span className="text-[var(--color-text-secondary)]"> · {getDaysSince(lastContacted)}d ago</span>
                            </p>
                        ) : (
                            <p className="text-sm text-[var(--color-text-secondary)] italic">Not set</p>
                        )}
                    </Field>
                </div>

                {/* Important Events */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className={labelClass.replace(' mb-2 block', '')}>important events</label>
                        {isEditing && (
                            <button onClick={addDate} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-brand)]">
                                <Plus size={16} />
                            </button>
                        )}
                    </div>

                    {importantDates.length > 0 ? (
                        <div className="space-y-3">
                            {importantDates.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {isEditing ? (
                                        <>
                                            <select
                                                value={item.type}
                                                onChange={(e) => updateDate(i, 'type', e.target.value)}
                                                className={`${inputClass} w-36`}
                                            >
                                                {DATE_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="description"
                                                value={item.label}
                                                onChange={(e) => updateDate(i, 'label', e.target.value)}
                                                className={`${inputClass} flex-1`}
                                            />
                                            <input
                                                type="date"
                                                value={item.date}
                                                onChange={(e) => updateDate(i, 'date', e.target.value)}
                                                className={inputClass}
                                            />
                                            <button onClick={() => removeDate(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-between w-full py-2 px-3 bg-[var(--color-bg-secondary)]/50 rounded-lg">
                                            <span className="text-sm">
                                                {DATE_TYPES.find(t => t.value === item.type)?.label.split(' ')[0] || '📅'}{' '}
                                                <span className="font-medium">{item.label || 'Unnamed'}</span>
                                            </span>
                                            <span className="text-xs text-[var(--color-text-secondary)]">
                                                {item.date ? formatDate(item.date) : '—'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add an event' : 'No events added'}
                        </p>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
