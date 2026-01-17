import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';

export function CustomSelect({ options, value, onChange, placeholder = "select..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border rounded-xl cursor-pointer transition-all ${isOpen ? 'border-brand ring-2 ring-brand ring-offset-1' : 'border-border hover:border-gray-300'
                    }`}
            >
                <span className={`text-sm lowercase ${selectedOption ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <Icons.Coordinates className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 flex flex-col"
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-50 sticky top-0 bg-white">
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="search..."
                                className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand lowercase"
                            />
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto flex-1 p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
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
