import React, { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const tactileSelectClass = `
    w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400
    cursor-pointer
`;

const tactileInputClass = `
    w-full px-4 py-3 text-sm rounded-[2px] transition-all
    bg-[var(--color-button-bg)]
    text-[var(--color-text-primary)]
    border-transparent
    shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]
    focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]
    placeholder:text-gray-400
`;

export default function TactileSelect({ value, onChange, options, placeholder, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(opt =>
            (opt.name || opt.label || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    // Handle both 'value' label based or object based options
    const selectedOption = options.find(opt => (opt.name === value || opt.code === value || opt.value === value || opt.label === value));

    // Display text: Try name -> label -> value -> placeholder
    const selectedText = selectedOption ? (selectedOption.name || selectedOption.label) : placeholder;

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`${tactileSelectClass} text-left flex items-center justify-between`}
            >
                <span className={selectedOption ? '' : 'text-gray-400'}>
                    {selectedText}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-[var(--color-border)] rounded-[2px] shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-[var(--color-border)]">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${tactileInputClass} pl-9`}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors lowercase ${(selectedOption === opt) ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : ''}`}
                                >
                                    {opt.name || opt.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
