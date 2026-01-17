import React, { useRef, useEffect } from 'react';

export function PhoneInput({ value = '', onChange, className = '' }) {
    // Ensure value is a string of digits
    const digits = value.replace(/\D/g, '').split('');
    const inputsRef = useRef([]);

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return;

        const newDigits = [...digits]; // Copy current digits
        // Pad with empty strings if needed up to 10
        while (newDigits.length < 10) newDigits.push('');

        // Take the last char entered (to allow overwrite)
        const char = val.slice(-1);
        newDigits[index] = char;

        // Reconstruct string
        const newValue = newDigits.join('').slice(0, 10);
        onChange({ target: { name: 'phone', value: newValue } });

        // Auto-advance
        if (char && index < 9) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            // If empty and backspace, go back and delete previous
            const newDigits = [...digits];
            // Ensure we have array structure
            while (newDigits.length < 10) newDigits.push('');

            inputsRef.current[index - 1]?.focus();
            // The change will be handled by the user pressing backspace again or we can delete here?
            // Standard behavior: move focus back, let user delete. 
            // Better: delete previous value immediately.
            newDigits[index - 1] = '';
            onChange({ target: { name: 'phone', value: newDigits.join('').slice(0, 10) } });
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 10);
        onChange({ target: { name: 'phone', value: pastedData } });
        // Focus last filled
        const lastIndex = Math.min(pastedData.length, 9);
        inputsRef.current[lastIndex]?.focus();
    };

    return (
        <div className={`flex gap-2 justify-center ${className}`}>
            {Array.from({ length: 10 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => inputsRef.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] || ''}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="w-10 h-12 text-center text-xl font-medium border-b-2 border-gray-100 focus:border-brand outline-none bg-transparent transition-colors placeholder:text-gray-200"
                    placeholder="0"
                />
            ))}
        </div>
    );
}
