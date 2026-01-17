import React, { useState, useEffect, useRef } from 'react';
import { DynamicInput } from './DynamicInput';

export function DateSelector({ value, onChange }) {
    // value is "YYYY-MM-DD" string or undefined
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const monthRef = useRef(null);
    const dayRef = useRef(null);
    const yearRef = useRef(null);

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            setYear(y);
            setMonth(m);
            setDay(d);
        } else {
            setDay('');
            setMonth('');
            setYear('');
        }
    }, [value]);

    const updateDate = (d, m, y) => {
        let newD = d !== undefined ? d : day;
        let newM = m !== undefined ? m : month;
        let newY = y !== undefined ? y : year;

        if (newY && newM && newD) {
            onChange(`${newY}-${newM.padStart(2, '0')}-${newD.padStart(2, '0')}`);
        } else if (!newY && !newM && !newD) {
            onChange('');
        }
    };

    const handleMonthChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMonth(val);
        updateDate(undefined, val, undefined);
        if (val.length === 2) dayRef.current?.focus();
    };

    const handleDayChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setDay(val);
        updateDate(val, undefined, undefined);
        if (val.length === 2) yearRef.current?.focus();
    };

    const handleYearChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        setYear(val);
        updateDate(undefined, undefined, val);
    };

    // Helper to focus input on click of the parent div if needed, 
    // but users will likely click inputs directly.

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-center w-12">
                <input
                    ref={monthRef}
                    value={month}
                    onChange={handleMonthChange}
                    placeholder="MM"
                    className="w-full text-center bg-transparent border-b border-gray-200 focus:border-brand outline-none pb-1 placeholder:text-gray-300 font-mono text-lg transition-colors"
                />
            </div>
            <span className="text-gray-300">/</span>
            <div className="flex flex-col items-center w-12">
                <input
                    ref={dayRef}
                    value={day}
                    onChange={handleDayChange}
                    placeholder="DD"
                    className="w-full text-center bg-transparent border-b border-gray-200 focus:border-brand outline-none pb-1 placeholder:text-gray-300 font-mono text-lg transition-colors"
                />
            </div>
            <span className="text-gray-300">/</span>
            <div className="flex flex-col items-center w-20">
                <input
                    ref={yearRef}
                    value={year}
                    onChange={handleYearChange}
                    placeholder="YYYY"
                    className="w-full text-center bg-transparent border-b border-gray-200 focus:border-brand outline-none pb-1 placeholder:text-gray-300 font-mono text-lg transition-colors"
                />
            </div>
        </div>
    );
}
