import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';

export function CustomSelect({ options, value, onChange, placeholder = "select..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    // Initial value population
    useEffect(() => {
        const selected = options.find(opt => opt.value === value);
        if (selected) {
            setSearch(selected.label);
        }
    }, [value, options]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset search to value if closed without selection? 
                // Or keep as is? Let's reset to ensure consistency.
                const selected = options.find(opt => opt.value === value);
                if (selected) setSearch(selected.label);
                else if (!value) setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value, options]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
        const selected = options.find(opt => opt.value === val);
        if (selected) setSearch(selected.label);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Combobox Trigger */}
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                        // Optional: clear value if user types something not in list?
                        // For now keep value until explicit selection or maybe partial match?
                        // Let's just track search.
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all lowercase text-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Icons.Coordinates className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 flex flex-col"
                    >
                        {/* Options List */}
                        <div className="overflow-y-auto flex-1 p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`px-3 py-2 rounded-lg text-sm cursor-pointer lowercase transition-colors ${opt.value === value
                                                ? 'bg-brand/10 text-brand font-medium'
                                                : 'text-text-primary hover:bg-gray-50'
                                            }`}
                                    >
                                        {opt.label}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-gray-400 lowercase">
                                    no matches found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
