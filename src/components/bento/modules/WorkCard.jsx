import React from 'react';
import { Briefcase, Building, Wrench, Target, Lightbulb, X } from 'lucide-react';

export default function WorkCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const clearField = (field) => {
        updateData({ [field]: '' });
    };

    const inputClass = `w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400`;
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = "text-xs font-semibold lowercase tracking-wider text-[var(--color-text-secondary)]";

    const Field = ({ icon: Icon, label, field, placeholder, multiline }) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-[var(--color-text-secondary)]" />
                <label className={labelClass}>{label}</label>
            </div>
            {isEditing ? (
                <div className="relative group/field">
                    {multiline ? (
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
                    )}
                    {data[field] && (
                        <button
                            onClick={() => clearField(field)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover/field:opacity-100 transition-opacity rounded-full hover:bg-red-50"
                            title="Clear field"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-sm">{data[field] || <span className="text-[var(--color-text-secondary)] italic">not set</span>}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Title & Company */}
            <div className="grid grid-cols-2 gap-4">
                <Field icon={Briefcase} label="job title" field="jobTitle" placeholder="software engineer" />
                <Field icon={Building} label="company" field="company" placeholder="acme inc." />
            </div>

            {/* What they work on */}
            <Field
                icon={Wrench}
                label="works on"
                field="whatTheyWorkOn"
                placeholder="building mobile apps, managing teams..."
            />

            {/* Skills */}
            <Field
                icon={Lightbulb}
                label="skills"
                field="skills"
                placeholder="design, python, leadership..."
            />

            {/* Aspirations */}
            <Field
                icon={Target}
                label="wants next"
                field="nextInLife"
                placeholder="start a company, get promoted..."
                multiline
            />
        </div>
    );
}
