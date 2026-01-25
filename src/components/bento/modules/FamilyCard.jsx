import React from 'react';
import BentoCard from '../Card';
import { Heart, Baby, PawPrint, Users, Plus, X } from 'lucide-react';

const PET_TYPES = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'];

export default function FamilyCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const data = module.data || {};

    const hasPartner = data.hasPartner || false;
    const partnerName = data.partnerName || '';
    const isMarried = data.isMarried || false;
    const kids = data.kids || [];
    const pets = data.pets || [];
    const keyPeople = data.keyPeople || [];

    const updateData = (updates) => {
        onUpdate?.({ ...data, ...updates });
    };

    const addKid = () => updateData({ kids: [...kids, { name: '', age: '' }] });
    const updateKid = (i, field, value) => {
        const updated = [...kids];
        updated[i] = { ...updated[i], [field]: value };
        updateData({ kids: updated });
    };
    const removeKid = (i) => updateData({ kids: kids.filter((_, idx) => idx !== i) });

    const addPet = () => updateData({ pets: [...pets, { name: '', type: 'dog' }] });
    const updatePet = (i, field, value) => {
        const updated = [...pets];
        updated[i] = { ...updated[i], [field]: value };
        updateData({ pets: updated });
    };
    const removePet = (i) => updateData({ pets: pets.filter((_, idx) => idx !== i) });

    const addKeyPerson = () => updateData({ keyPeople: [...keyPeople, { name: '', relationship: '' }] });
    const updateKeyPerson = (i, field, value) => {
        const updated = [...keyPeople];
        updated[i] = { ...updated[i], [field]: value };
        updateData({ keyPeople: updated });
    };
    const removeKeyPerson = (i) => updateData({ keyPeople: keyPeople.filter((_, idx) => idx !== i) });

    const inputClass = `w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400`;
    const labelClass = "text-xs font-semibold lowercase tracking-wider text-[var(--color-text-secondary)] mb-2 block";

    const Toggle = ({ checked, onChange, label }) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">{label}</span>
            {isEditing ? (
                <button
                    type="button"
                    onClick={() => onChange(!checked)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-[var(--color-brand)]' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            ) : (
                <span className={`text-sm font-medium ${checked ? 'text-green-600' : 'text-gray-400'}`}>
                    {checked ? 'Yes' : 'No'}
                </span>
            )}
        </div>
    );

    const Section = ({ icon: Icon, label, children, onAdd }) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={14} className="text-[var(--color-text-secondary)]" />
                    <span className={labelClass.replace(' mb-2 block', '')}>{label}</span>
                </div>
                {isEditing && onAdd && (
                    <button onClick={onAdd} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-brand)]">
                        <Plus size={16} />
                    </button>
                )}
            </div>
            {children}
        </div>
    );

    return (
        <BentoCard
            title="family"
            icon={Heart}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
        >
            <div className="space-y-6">
                {/* Partner Section */}
                <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 space-y-3">
                    <Toggle
                        checked={hasPartner}
                        onChange={(v) => updateData({ hasPartner: v, isMarried: v ? isMarried : false })}
                        label="Has a partner?"
                    />

                    {hasPartner && (
                        <div className="pl-4 border-l-2 border-[var(--color-brand)]/30 space-y-4 mt-3">
                            <div>
                                <label className={labelClass}>partner's name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        placeholder="enter name"
                                        value={partnerName}
                                        onChange={(e) => updateData({ partnerName: e.target.value })}
                                        className={`${inputClass} w-full`}
                                    />
                                ) : (
                                    <p className="text-sm font-medium">{partnerName || <span className="opacity-40 italic">Not set</span>}</p>
                                )}
                            </div>

                            <Toggle
                                checked={isMarried}
                                onChange={(v) => updateData({ isMarried: v })}
                                label="Married?"
                            />
                        </div>
                    )}
                </div>

                {/* Kids Section */}
                <Section icon={Baby} label="kids" onAdd={addKid}>
                    {kids.length > 0 ? (
                        <div className="space-y-3">
                            {kids.map((kid, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="name"
                                                value={kid.name}
                                                onChange={(e) => updateKid(i, 'name', e.target.value)}
                                                className={`${inputClass} flex-1`}
                                            />
                                            <input
                                                type="text"
                                                placeholder="age"
                                                value={kid.age}
                                                onChange={(e) => updateKid(i, 'age', e.target.value)}
                                                className={`${inputClass} w-20`}
                                            />
                                            <button onClick={() => removeKid(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-sm">
                                            <span className="font-medium">{kid.name || 'Unnamed'}</span>
                                            {kid.age && <span className="text-[var(--color-text-secondary)]"> · Age {kid.age}</span>}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add a child' : 'no kids added'}
                        </p>
                    )}
                </Section>

                {/* Pets Section */}
                <Section icon={PawPrint} label="pets" onAdd={addPet}>
                    {pets.length > 0 ? (
                        <div className="space-y-3">
                            {pets.map((pet, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="pet name"
                                                value={pet.name}
                                                onChange={(e) => updatePet(i, 'name', e.target.value)}
                                                className={`${inputClass} flex-1`}
                                            />
                                            <select
                                                value={pet.type}
                                                onChange={(e) => updatePet(i, 'type', e.target.value)}
                                                className={`${inputClass} w-28`}
                                            >
                                                {PET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <button onClick={() => removePet(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-sm">
                                            <span className="font-medium">{pet.name || 'Unnamed'}</span>
                                            <span className="text-[var(--color-text-secondary)]"> · {pet.type}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add a pet' : 'no pets added'}
                        </p>
                    )}
                </Section>

                {/* Key People Section */}
                <Section icon={Users} label="key people in their life" onAdd={addKeyPerson}>
                    {keyPeople.length > 0 ? (
                        <div className="space-y-3">
                            {keyPeople.map((person, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="name"
                                                value={person.name}
                                                onChange={(e) => updateKeyPerson(i, 'name', e.target.value)}
                                                className={`${inputClass} flex-1`}
                                            />
                                            <input
                                                type="text"
                                                placeholder="relationship"
                                                value={person.relationship}
                                                onChange={(e) => updateKeyPerson(i, 'relationship', e.target.value)}
                                                className={`${inputClass} w-32`}
                                            />
                                            <button onClick={() => removeKeyPerson(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-sm">
                                            <span className="font-medium">{person.name || 'Unnamed'}</span>
                                            {person.relationship && <span className="text-[var(--color-text-secondary)]"> · {person.relationship}</span>}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add someone' : 'no key people added'}
                        </p>
                    )}
                </Section>
            </div>
        </BentoCard>
    );
}
