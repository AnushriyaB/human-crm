import React from 'react';
import BentoCard from '../Card';
import { Calendar, Gift, Heart, Plus, X } from 'lucide-react';

export default function DateCard({ module, isEditing, onUpdate }) {
    const data = module.data || {};
    const dates = data.dates || [];

    const getIcon = (type) => {
        switch (type) {
            case 'birthday': return Gift;
            case 'anniversary': return Heart;
            default: return Calendar;
        }
    };

    const getDaysUntil = (dateStr) => {
        const today = new Date();
        const target = new Date(dateStr);
        target.setFullYear(today.getFullYear());
        if (target < today) target.setFullYear(today.getFullYear() + 1);
        const diff = target - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const handleAddDate = () => {
        onUpdate?.({
            ...data,
            dates: [...dates, { label: '', date: '', type: 'other' }]
        });
    };

    const handleDateChange = (index, field, value) => {
        const updated = [...dates];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate?.({ ...data, dates: updated });
    };

    const handleRemoveDate = (index) => {
        const updated = dates.filter((_, i) => i !== index);
        onUpdate?.({ ...data, dates: updated });
    };

    const inputClass = "px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)]";

    return (
        <BentoCard
            title="Timeline"
            icon={Calendar}
            headerAction={isEditing && (
                <button
                    onClick={handleAddDate}
                    className="p-1 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-brand)]"
                >
                    <Plus size={14} />
                </button>
            )}
        >
            <div className="space-y-3">
                {dates.map((item, i) => {
                    const Icon = getIcon(item.type);
                    const days = item.date ? getDaysUntil(item.date) : null;
                    return (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                            {isEditing ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <select
                                        value={item.type}
                                        onChange={(e) => handleDateChange(i, 'type', e.target.value)}
                                        className={`${inputClass} w-24`}
                                    >
                                        <option value="birthday">🎂 Birthday</option>
                                        <option value="anniversary">💍 Anniversary</option>
                                        <option value="other">📅 Other</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Label"
                                        value={item.label}
                                        onChange={(e) => handleDateChange(i, 'label', e.target.value)}
                                        className={`${inputClass} flex-1`}
                                    />
                                    <input
                                        type="date"
                                        value={item.date}
                                        onChange={(e) => handleDateChange(i, 'date', e.target.value)}
                                        className={inputClass}
                                    />
                                    <button
                                        onClick={() => handleRemoveDate(i)}
                                        className="p-1 rounded hover:bg-red-50 text-red-400"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${days !== null && days < 30 ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-500'}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{item.label || 'Unnamed'}</div>
                                            <div className="text-xs text-[var(--color-text-secondary)]">
                                                {item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'No date set'}
                                            </div>
                                        </div>
                                    </div>
                                    {days !== null && (
                                        <div className="text-right">
                                            <div className="text-lg font-bold leading-none">{days}</div>
                                            <div className="text-[9px] uppercase tracking-wide opacity-50">Days</div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
                {dates.length === 0 && (
                    <div className="text-center py-4 text-[var(--color-text-secondary)] text-sm italic">
                        {isEditing ? 'Click + to add dates' : 'No important dates.'}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}
