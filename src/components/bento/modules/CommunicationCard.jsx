import React from 'react';
import BentoCard from '../Card';
import { MessageCircle, Phone, Mail, AtSign, Clock, Bell, Plus, X } from 'lucide-react';

const PLATFORMS = [
    'WhatsApp', 'iMessage', 'Telegram', 'Signal', 'Messenger',
    'Slack', 'Discord', 'Email', 'Phone Call', 'Text/SMS'
];

const CHECK_IN_FREQUENCY = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every 2 weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'special', label: 'Special occasions' }
];

export default function CommunicationCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};
    const socialLinks = data.socialLinks || [];

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const addSocialLink = () => updateData({
        socialLinks: [...socialLinks, { platform: '', handle: '' }]
    });
    const updateSocialLink = (i, field, value) => {
        const updated = [...socialLinks];
        updated[i] = { ...updated[i], [field]: value };
        updateData({ socialLinks: updated });
    };
    const removeSocialLink = (i) => updateData({
        socialLinks: socialLinks.filter((_, idx) => idx !== i)
    });

    const inputClass = `w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400`;
    const selectClass = inputClass;
    const labelClass = "text-xs font-semibold lowercase tracking-wider text-[var(--color-text-secondary)] mb-2 block";

    return (
        <BentoCard
            title="communication"
            icon={MessageCircle}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
        >
            <div className="space-y-5">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>phone</label>
                        </div>
                        {isEditing ? (
                            <input
                                type="tel"
                                placeholder="+1 555 123 4567"
                                value={data.phone || ''}
                                onChange={(e) => updateData({ phone: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : (
                            <p className="text-sm">{data.phone || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>email</label>
                        </div>
                        {isEditing ? (
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={data.email || ''}
                                onChange={(e) => updateData({ email: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : (
                            <p className="text-sm truncate">{data.email || <span className="text-[var(--color-text-secondary)] italic">Not set</span>}</p>
                        )}
                    </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AtSign size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>social links</label>
                        </div>
                        {isEditing && (
                            <button onClick={addSocialLink} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-brand)]">
                                <Plus size={16} />
                            </button>
                        )}
                    </div>
                    {socialLinks.length > 0 ? (
                        <div className="space-y-3">
                            {socialLinks.map((link, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Platform"
                                                value={link.platform}
                                                onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                                                className={`${inputClass} w-32`}
                                            />
                                            <input
                                                type="text"
                                                placeholder="@handle or URL"
                                                value={link.handle}
                                                onChange={(e) => updateSocialLink(i, 'handle', e.target.value)}
                                                className={`${inputClass} flex-1`}
                                            />
                                            <button onClick={() => removeSocialLink(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-sm">
                                            <span className="font-medium">{link.platform || 'Unknown'}:</span> {link.handle}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add a link' : 'None added'}
                        </p>
                    )}
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>preferred</label>
                        </div>
                        {isEditing ? (
                            <select
                                value={data.preferredPlatform || ''}
                                onChange={(e) => updateData({ preferredPlatform: e.target.value })}
                                className={`${selectClass} w-full`}
                            >
                                <option value="">Select...</option>
                                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        ) : (
                            <p className="text-sm">{data.preferredPlatform || <span className="text-[var(--color-text-secondary)] italic">—</span>}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>best time</label>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="Evenings..."
                                value={data.bestTimeToReach || ''}
                                onChange={(e) => updateData({ bestTimeToReach: e.target.value })}
                                className={`${inputClass} w-full`}
                            />
                        ) : (
                            <p className="text-sm">{data.bestTimeToReach || <span className="text-[var(--color-text-secondary)] italic">—</span>}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Bell size={14} className="text-[var(--color-text-secondary)]" />
                            <label className={labelClass.replace(' mb-2 block', '')}>check-in</label>
                        </div>
                        {isEditing ? (
                            <select
                                value={data.checkInFrequency || ''}
                                onChange={(e) => updateData({ checkInFrequency: e.target.value })}
                                className={`${selectClass} w-full`}
                            >
                                <option value="">Select...</option>
                                {CHECK_IN_FREQUENCY.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        ) : (
                            <p className="text-sm capitalize">{data.checkInFrequency || <span className="text-[var(--color-text-secondary)] italic">—</span>}</p>
                        )}
                    </div>
                </div>
            </div>
        </BentoCard>
    );
}
