import React from 'react';

/**
 * Toggle - A tactile switch component for boolean values
 * 
 * @param {boolean} checked - Current state
 * @param {function} onChange - Callback when toggled 
 * @param {string} label - Label text (displayed on left)
 * @param {boolean} disabled - Whether the toggle is disabled
 * @param {boolean} readOnly - If true, displays as text instead of switch
 * @param {string} size - 'sm' | 'default' | 'lg'
 */
export default function Toggle({
    checked = false,
    onChange,
    label,
    disabled = false,
    readOnly = false,
    size = 'default'
}) {
    const sizes = {
        sm: { track: 'w-9 h-5', thumb: 'w-3 h-3 top-1', translate: 'translate-x-4', label: 'text-xs' },
        default: { track: 'w-11 h-6', thumb: 'w-4 h-4 top-1', translate: 'translate-x-6', label: 'text-sm' },
        lg: { track: 'w-14 h-7', thumb: 'w-5 h-5 top-1', translate: 'translate-x-8', label: 'text-base' }
    };

    const s = sizes[size] || sizes.default;

    if (readOnly) {
        return (
            <div className="flex items-center justify-between py-2">
                {label && <span className={`${s.label} font-medium text-[var(--color-text-primary)]`}>{label}</span>}
                <span className={`${s.label} font-medium ${checked ? 'text-green-600' : 'text-gray-400'}`}>
                    {checked ? 'Yes' : 'No'}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-2">
            {label && <span className={`${s.label} font-medium text-[var(--color-text-primary)]`}>{label}</span>}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange?.(!checked)}
                className={`
                    ${s.track} rounded-full relative transition-colors
                    ${checked ? 'bg-[var(--color-brand)]' : 'bg-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2
                `}
            >
                <div
                    className={`
                        absolute ${s.thumb} rounded-full bg-white shadow transition-transform
                        ${checked ? s.translate : 'translate-x-1'}
                    `}
                />
            </button>
        </div>
    );
}
