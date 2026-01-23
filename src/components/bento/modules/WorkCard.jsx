import React from 'react';
import BentoCard from '../Card';
import { Briefcase, Building, Mail, Phone } from 'lucide-react';

export default function WorkCard({ module, isEditing, onUpdate }) {
    const data = module.data || {};
    const company = data.company || '';
    const role = data.role || '';
    const workEmail = data.workEmail || '';
    const workPhone = data.workPhone || '';

    const handleChange = (field, value) => {
        onUpdate?.({ ...data, [field]: value });
    };

    const inputClass = "w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)]";

    return (
        <BentoCard title="Work" icon={Briefcase}>
            <div className="space-y-3">
                {/* Company & Role */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                        <Building size={14} />
                        <span className="text-xs font-medium uppercase tracking-wide">Company</span>
                    </div>
                    {isEditing ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Company name"
                                value={company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                className={inputClass}
                            />
                            <input
                                type="text"
                                placeholder="Role / Title"
                                value={role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    ) : (
                        <div className="text-sm">
                            {company ? (
                                <>
                                    <span className="font-medium">{company}</span>
                                    {role && <span className="text-[var(--color-text-secondary)]"> · {role}</span>}
                                </>
                            ) : (
                                <span className="text-[var(--color-text-secondary)] italic">Not set</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Work Contact */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <div className="flex items-center gap-1 text-[var(--color-text-secondary)] mb-1">
                            <Mail size={12} />
                            <span className="text-[10px] uppercase">Work Email</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="email"
                                placeholder="work@company.com"
                                value={workEmail}
                                onChange={(e) => handleChange('workEmail', e.target.value)}
                                className={inputClass}
                            />
                        ) : (
                            <div className="text-xs truncate">
                                {workEmail || <span className="italic text-[var(--color-text-secondary)]">—</span>}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-[var(--color-text-secondary)] mb-1">
                            <Phone size={12} />
                            <span className="text-[10px] uppercase">Work Phone</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="tel"
                                placeholder="+1 555 123 4567"
                                value={workPhone}
                                onChange={(e) => handleChange('workPhone', e.target.value)}
                                className={inputClass}
                            />
                        ) : (
                            <div className="text-xs truncate">
                                {workPhone || <span className="italic text-[var(--color-text-secondary)]">—</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BentoCard>
    );
}
