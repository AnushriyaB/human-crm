import React, { useState } from 'react';
import BentoCard from '../Card';
import { Heart, Baby, PawPrint, Plus, X, Calendar } from 'lucide-react';

export default function FamilyCard({ module, isEditing, onUpdate }) {
    const data = module.data || {};
    const partner = data.partner || { name: '', anniversary: '' };
    const children = data.children || [];
    const pets = data.pets || [];

    const handlePartnerChange = (field, value) => {
        onUpdate?.({
            ...data,
            partner: { ...partner, [field]: value }
        });
    };

    const handleAddChild = () => {
        onUpdate?.({
            ...data,
            children: [...children, { name: '', birthday: '' }]
        });
    };

    const handleChildChange = (index, field, value) => {
        const updated = [...children];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate?.({ ...data, children: updated });
    };

    const handleRemoveChild = (index) => {
        const updated = children.filter((_, i) => i !== index);
        onUpdate?.({ ...data, children: updated });
    };

    const handleAddPet = () => {
        onUpdate?.({
            ...data,
            pets: [...pets, { name: '', type: 'dog' }]
        });
    };

    const handlePetChange = (index, field, value) => {
        const updated = [...pets];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate?.({ ...data, pets: updated });
    };

    const handleRemovePet = (index) => {
        const updated = pets.filter((_, i) => i !== index);
        onUpdate?.({ ...data, pets: updated });
    };

    const inputClass = "w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:border-[var(--color-brand)]";

    return (
        <BentoCard title="Family" icon={Heart} className="col-span-2">
            <div className="space-y-4">
                {/* Partner Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                        <Heart size={14} />
                        <span className="text-xs font-medium uppercase tracking-wide">Partner</span>
                    </div>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Partner's name"
                                value={partner.name}
                                onChange={(e) => handlePartnerChange('name', e.target.value)}
                                className={inputClass}
                            />
                            <input
                                type="date"
                                placeholder="Anniversary"
                                value={partner.anniversary}
                                onChange={(e) => handlePartnerChange('anniversary', e.target.value)}
                                className={`${inputClass} w-40`}
                            />
                        </div>
                    ) : (
                        <div className="text-sm">
                            {partner.name ? (
                                <span className="font-medium">{partner.name}</span>
                            ) : (
                                <span className="text-[var(--color-text-secondary)] italic">Not set</span>
                            )}
                            {partner.anniversary && (
                                <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                                    · Anniversary: {new Date(partner.anniversary).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Children Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <Baby size={14} />
                            <span className="text-xs font-medium uppercase tracking-wide">Children</span>
                        </div>
                        {isEditing && (
                            <button
                                onClick={handleAddChild}
                                className="p-1 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-brand)]"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                    {children.length > 0 ? (
                        <div className="space-y-2">
                            {children.map((child, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={child.name}
                                                onChange={(e) => handleChildChange(i, 'name', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="date"
                                                value={child.birthday}
                                                onChange={(e) => handleChildChange(i, 'birthday', e.target.value)}
                                                className={`${inputClass} w-40`}
                                            />
                                            <button
                                                onClick={() => handleRemoveChild(i)}
                                                className="p-1 rounded hover:bg-red-50 text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-sm">
                                            <span className="font-medium">{child.name || 'Unnamed'}</span>
                                            {child.birthday && (
                                                <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                                                    · {new Date(child.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add' : 'No children added'}
                        </div>
                    )}
                </div>

                {/* Pets Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <PawPrint size={14} />
                            <span className="text-xs font-medium uppercase tracking-wide">Pets</span>
                        </div>
                        {isEditing && (
                            <button
                                onClick={handleAddPet}
                                className="p-1 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-brand)]"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                    {pets.length > 0 ? (
                        <div className="space-y-2">
                            {pets.map((pet, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Pet name"
                                                value={pet.name}
                                                onChange={(e) => handlePetChange(i, 'name', e.target.value)}
                                                className={inputClass}
                                            />
                                            <select
                                                value={pet.type}
                                                onChange={(e) => handlePetChange(i, 'type', e.target.value)}
                                                className={`${inputClass} w-24`}
                                            >
                                                <option value="dog">🐕 Dog</option>
                                                <option value="cat">🐈 Cat</option>
                                                <option value="bird">🐦 Bird</option>
                                                <option value="fish">🐠 Fish</option>
                                                <option value="other">🐾 Other</option>
                                            </select>
                                            <button
                                                onClick={() => handleRemovePet(i)}
                                                className="p-1 rounded hover:bg-red-50 text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-sm">
                                            <span className="font-medium">{pet.name || 'Unnamed'}</span>
                                            <span className="ml-1 text-xs">
                                                {pet.type === 'dog' && '🐕'}
                                                {pet.type === 'cat' && '🐈'}
                                                {pet.type === 'bird' && '🐦'}
                                                {pet.type === 'fish' && '🐠'}
                                                {pet.type === 'other' && '🐾'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-[var(--color-text-secondary)] italic">
                            {isEditing ? 'Click + to add' : 'No pets added'}
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
