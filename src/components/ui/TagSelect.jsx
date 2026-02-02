import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * TagSelect - Multi-select with preset chips and custom input
 * 
 * @param {string[]} value - Selected tags
 * @param {function} onChange - Callback when selection changes
 * @param {string[]} presets - Preset options to show as chips
 * @param {string} placeholder - Placeholder for custom input
 * @param {string} label - Optional label
 * @param {boolean} allowCustom - Allow adding custom tags (default: true)
 * @param {number} maxTags - Maximum number of tags allowed
 */
export default function TagSelect({
    value = [],
    onChange,
    presets = [],
    placeholder = 'type to add...',
    label,
    allowCustom = true,
    maxTags = 10
}) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const handleAddTag = (tag) => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
            onChange?.([...value, trimmed]);
        }
        setInputValue('');
    };

    const handleRemoveTag = (tagToRemove) => {
        onChange?.(value.filter(t => t !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            handleAddTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            handleRemoveTag(value[value.length - 1]);
        }
    };

    const togglePreset = (preset) => {
        if (value.includes(preset)) {
            handleRemoveTag(preset);
        } else if (value.length < maxTags) {
            onChange?.([...value, preset]);
        }
    };

    // Available presets (not already selected)
    const availablePresets = presets.filter(p => !value.includes(p));

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-xs font-medium lowercase text-[var(--color-text-secondary)] mb-1.5 block">
                    {label}
                </label>
            )}

            {/* Selected tags */}
            <div className="flex flex-wrap gap-2">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                            bg-[var(--color-brand)] text-white
                            shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.2)]"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                {/* Custom input */}
                {allowCustom && value.length < maxTags && (
                    <div className={`
                        inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs
                        bg-[var(--color-button-bg)] border border-transparent
                        ${isFocused ? 'ring-2 ring-[var(--color-brand)]' : ''}
                        shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.08)]
                        transition-all
                    `}>
                        <Plus size={12} className="text-[var(--color-text-secondary)]" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholder}
                            className="bg-transparent outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] min-w-[80px] w-auto"
                            style={{ width: `${Math.max(80, inputValue.length * 8)}px` }}
                        />
                    </div>
                )}
            </div>

            {/* Preset suggestions */}
            {availablePresets.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {availablePresets.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => togglePreset(preset)}
                            disabled={value.length >= maxTags}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all lowercase
                                bg-[var(--color-button-bg)] text-[var(--color-text-secondary)]
                                shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.08),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                                hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.08),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                                hover:text-[var(--color-text-primary)]
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
