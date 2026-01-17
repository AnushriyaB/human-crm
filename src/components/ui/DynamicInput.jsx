import React, { useState, useRef, useEffect } from 'react';

export function DynamicInput({ value, onChange, placeholder, className = "", inputClassName = "", ...props }) {
    // We use a hidden span to measure the width of the text
    const spanRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (spanRef.current) {
            // Add a bit of padding (e.g. 10px) to ensure cursor room
            setWidth(spanRef.current.offsetWidth + 20);
        }
    }, [value, placeholder]);

    return (
        <div className={`relative inline-flex flex-col ${className}`}>
            {/* Hidden span for measurement */}
            <span
                ref={spanRef}
                className="absolute opacity-0 pointer-events-none whitespace-pre font-inherit text-inherit"
                aria-hidden="true"
            >
                {value || placeholder || ''}
            </span>

            {/* The Input */}
            <input
                {...props}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus && props.onFocus(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur && props.onBlur(e);
                }}
                style={{ width: Math.max(width, 40) }} // Min width
                className={`bg-transparent border-none outline-none p-0 text-text-primary placeholder:text-gray-300 font-inherit transition-all duration-200 caret-brand font-medium ${inputClassName}`}
            />
        </div>
    );
}
