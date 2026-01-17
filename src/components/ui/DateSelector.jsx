import React, { useState, useEffect } from 'react';
import { DynamicInput } from './DynamicInput';

export function DateSelector({ value, onChange }) {
    // value is "YYYY-MM-DD" string or undefined
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            setYear(y);
            setMonth(m);
            setDay(d);
        }
    }, [value]);

    const updateDate = (d, m, y) => {
        // Only update if we have valid parts or empty
        // Simple logic: if all 3 set, emit date string. Else emit partial or handle properly?
        // Standard HTML date input expects YYYY-MM-DD.
        // Let's just track state and emit when valid.

        let newD = d || day;
        let newM = m || month;
        let newY = y || year;

        // Auto-pad single digits if length is 1 and user blurred or typed 2 digits?
        // Keep it simple for now: text inputs.

        // Construct date:
        if (newY && newM && newD) {
            onChange(`${newY}-${newM.padStart(2, '0')}-${newD.padStart(2, '0')}`);
        } else {
            // Pass empty or partial? user might be clearing it.
            // If completely empty, pass empty string to clear.
            if (!newY && !newM && !newD) onChange('');
        }
    };

    const handleDayChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setDay(val);
        updateDate(val, null, null);
    };

    const handleMonthChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMonth(val);
        updateDate(null, val, null);
    };

    const handleYearChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        setYear(val);
        updateDate(null, null, val);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
                <DynamicInput
                    value={day}
                    onChange={handleDayChange}
                    placeholder="DD"
                    className="text-center font-mono"
                    maxLength={2}
                />
            </div>
            <span className="text-gray-300">/</span>
            <div className="flex flex-col items-center">
                <DynamicInput
                    value={month}
                    onChange={handleMonthChange}
                    placeholder="MM"
                    className="text-center font-mono"
                    maxLength={2}
                />
            </div>
            <span className="text-gray-300">/</span>
            <div className="flex flex-col items-center">
                <DynamicInput
                    value={year}
                    onChange={handleYearChange}
                    placeholder="YYYY"
                    className="text-center font-mono"
                    maxLength={4}
                />
            </div>
        </div>
    );
}
