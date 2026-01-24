/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Satoshi', 'sans-serif'],
            },
            colors: {
                brand: 'var(--color-brand)',
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                border: 'var(--color-border)',
                'card-bg': 'var(--color-card-bg)',
                'button-bg': 'var(--color-button-bg)',
                highlight: 'var(--color-highlight)',
            },
            borderRadius: {
                'tactical': 'var(--radius-button)',
                'card': 'var(--radius-card)',
            },
            boxShadow: {
                'active': 'var(--shadow-active)',
                'card': 'var(--shadow-card)',
            }
        },
    },
    plugins: [],
}
