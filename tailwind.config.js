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
                brand: '#3B82F6',
                text: {
                    primary: '#1A1A1A',
                    secondary: '#4D4D4D',
                },
                border: {
                    DEFAULT: '#E5E5E5',
                }
            }
        },
    },
    plugins: [],
}
