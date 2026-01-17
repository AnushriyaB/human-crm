import React, { useState, useEffect } from 'react';

export function EmailInput({ value = '', onChange, className = '' }) {
    const [user, setUser] = useState('');
    const [domain, setDomain] = useState('');

    useEffect(() => {
        if (value) {
            const parts = value.split('@');
            setUser(parts[0] || '');
            setDomain(parts[1] || '');
        } else {
            setUser('');
            setDomain('');
        }
    }, [value]);

    const handleUserChange = (e) => {
        const newUser = e.target.value;
        setUser(newUser);
        onChange({ target: { name: 'email', value: `${newUser}@${domain}` } });
    };

    const handleDomainChange = (e) => {
        const newDomain = e.target.value;
        setDomain(newDomain);
        onChange({ target: { name: 'email', value: `${user}@${newDomain}` } });
    };

    return (
        <div className={`flex items-baseline justify-center gap-1 ${className}`}>
            <input
                type="text"
                value={user}
                onChange={handleUserChange}
                placeholder="hello"
                className="text-right text-xl lg:text-2xl outline-none bg-transparent border-b border-transparent focus:border-brand placeholder:text-gray-300 w-[45%] transition-colors font-medium"
            />
            <span className="text-xl lg:text-2xl text-gray-400 font-medium">@</span>
            <input
                type="text"
                value={domain}
                onChange={handleDomainChange}
                placeholder="example.com"
                className="text-left text-xl lg:text-2xl outline-none bg-transparent border-b border-transparent focus:border-brand placeholder:text-gray-300 w-[45%] transition-colors font-medium"
            />
        </div>
    );
}
