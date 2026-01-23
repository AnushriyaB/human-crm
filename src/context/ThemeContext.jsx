import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const themes = {
    tactical: {
        name: 'tactical',
        colors: {
            brand: '#3B82F6',
            background: '#FFFFFF',
            text: {
                primary: '#1A1A1A',
                secondary: '#4D4D4D',
            },
            border: '#E5E5E5',
            cardBg: '#FFFFFF',
            buttonBg: '#F9FAFB',
            highlight: '#FFFFFF',
        },
        borderRadius: {
            button: '2px',
            card: '2px',
            input: '0.75rem',
        },
        shadows: {
            active: 'inset 0 2px 4px 0 rgba(59, 130, 246, 0.5)',
            card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
    },
    dark: {
        name: 'dark',
        colors: {
            brand: '#60A5FA', // Lighter blue for dark mode
            background: '#0F172A', // Dark navy blue
            text: {
                primary: '#F1F5F9',
                secondary: '#94A3B8',
            },
            border: '#1E293B',
            cardBg: '#1E293B',
            buttonBg: '#1E293B',
            highlight: '#334155', // Lighter slate for toggles/interactive elements
        },
        borderRadius: {
            button: '2px',
            card: '2px',
            input: '0.75rem',
        },
        shadows: {
            active: '0 0 15px rgba(96, 165, 250, 0.5), inset 0 0 0 1px rgba(96, 165, 250, 0.8)', // Lights on effect
            card: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        },
    },
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = localStorage.getItem('human-crm-theme');
        return saved || 'tactical';
    });

    useEffect(() => {
        localStorage.setItem('human-crm-theme', currentTheme);

        // Apply theme class to document
        document.documentElement.classList.remove('theme-tactical', 'theme-dark');
        document.documentElement.classList.add(`theme-${currentTheme}`);

        // Apply CSS variables
        const theme = themes[currentTheme];
        const root = document.documentElement;

        root.style.setProperty('--color-brand', theme.colors.brand);
        root.style.setProperty('--color-background', theme.colors.background);
        root.style.setProperty('--color-text-primary', theme.colors.text.primary);
        root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
        root.style.setProperty('--color-border', theme.colors.border);
        root.style.setProperty('--color-card-bg', theme.colors.cardBg);
        root.style.setProperty('--color-button-bg', theme.colors.buttonBg);
        root.style.setProperty('--color-highlight', theme.colors.highlight);
        root.style.setProperty('--radius-button', theme.borderRadius.button);
        root.style.setProperty('--radius-card', theme.borderRadius.card);
        root.style.setProperty('--radius-input', theme.borderRadius.input);
        root.style.setProperty('--shadow-active', theme.shadows.active);
        root.style.setProperty('--shadow-card', theme.shadows.card);
        root.style.setProperty('--map-opacity', currentTheme === 'dark' ? '0.1' : '0.2');
    }, [currentTheme]);

    const toggleTheme = () => {
        setCurrentTheme(prev => prev === 'tactical' ? 'dark' : 'tactical');
    };

    const value = {
        theme: currentTheme,
        themeConfig: themes[currentTheme],
        toggleTheme,
        setTheme: setCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
