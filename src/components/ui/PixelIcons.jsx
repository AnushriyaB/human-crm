import React from 'react';

// Pixel-style custom icons matching the uploaded examples
export const PixelIcons = {
    // User/Person icon (pixel style)
    Person: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="8" width="8" height="4" fill="currentColor" />
            <rect x="10" y="12" width="12" height="2" fill="currentColor" />
            <rect x="8" y="14" width="16" height="2" fill="currentColor" />
            <rect x="12" y="16" width="8" height="8" fill="currentColor" />
            <rect x="8" y="20" width="4" height="4" fill="currentColor" />
            <rect x="20" y="20" width="4" height="4" fill="currentColor" />
        </svg>
    ),

    // Location/Map Pin (pixel style)
    LocationPin: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="6" width="4" height="2" fill="currentColor" />
            <rect x="12" y="8" width="8" height="2" fill="currentColor" />
            <rect x="10" y="10" width="12" height="6" fill="currentColor" />
            <rect x="12" y="16" width="8" height="2" fill="currentColor" />
            <rect x="14" y="18" width="4" height="6" fill="currentColor" />
            <rect x="14" y="11" width="4" height="3" fill="white" fillOpacity="0.3" />
        </svg>
    ),

    // Heart (pixel style)
    HeartPixel: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="10" width="4" height="2" fill="currentColor" />
            <rect x="20" y="10" width="4" height="2" fill="currentColor" />
            <rect x="6" y="12" width="8" height="2" fill="currentColor" />
            <rect x="18" y="12" width="8" height="2" fill="currentColor" />
            <rect x="6" y="14" width="20" height="2" fill="currentColor" />
            <rect x="8" y="16" width="16" height="2" fill="currentColor" />
            <rect x="10" y="18" width="12" height="2" fill="currentColor" />
            <rect x="12" y="20" width="8" height="2" fill="currentColor" />
            <rect x="14" y="22" width="4" height="2" fill="currentColor" />
        </svg>
    ),

    // Calendar (pixel style)
    CalendarPixel: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="12" y="6" width="2" height="4" fill="currentColor" />
            <rect x="18" y="6" width="2" height="4" fill="currentColor" />
            <line x1="8" y1="13" x2="24" y2="13" stroke="currentColor" strokeWidth="2" />
            <rect x="11" y="16" width="2" height="2" fill="currentColor" />
            <rect x="15" y="16" width="2" height="2" fill="currentColor" />
            <rect x="19" y="16" width="2" height="2" fill="currentColor" />
            <rect x="11" y="20" width="2" height="2" fill="currentColor" />
            <rect x="15" y="20" width="2" height="2" fill="currentColor" />
        </svg>
    ),

    // Sparkle/Star (pixel style)
    SparklePixel: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="6" width="2" height="6" fill="currentColor" />
            <rect x="15" y="20" width="2" height="6" fill="currentColor" />
            <rect x="6" y="15" width="6" height="2" fill="currentColor" />
            <rect x="20" y="15" width="6" height="2" fill="currentColor" />
            <rect x="11" y="11" width="2" height="2" fill="currentColor" />
            <rect x="19" y="11" width="2" height="2" fill="currentColor" />
            <rect x="11" y="19" width="2" height="2" fill="currentColor" />
            <rect x="19" y="19" width="2" height="2" fill="currentColor" />
            <rect x="14" y="14" width="4" height="4" fill="currentColor" />
        </svg>
    ),

    // Gift/Present (pixel style)
    GiftPixel: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="6" width="4" height="4" fill="currentColor" />
            <rect x="18" y="6" width="4" height="4" fill="currentColor" />
            <rect x="8" y="10" width="16" height="4" fill="currentColor" />
            <rect x="8" y="14" width="16" height="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="15" y="14" width="2" height="10" fill="currentColor" />
            <rect x="8" y="18" width="16" height="2" fill="currentColor" fillOpacity="0.3" />
        </svg>
    ),

    // Phone (pixel style)
    PhonePixel: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="6" width="12" height="20" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="14" y="22" width="4" height="2" fill="currentColor" />
            <rect x="12" y="9" width="8" height="10" fill="currentColor" fillOpacity="0.2" />
        </svg>
    ),

    // Message/Chat (pixel style)
    MessagePixel: ({ className }) => (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="14" y="22" width="4" height="4" fill="currentColor" />
            <rect x="10" y="13" width="12" height="2" fill="currentColor" />
            <rect x="10" y="17" width="8" height="2" fill="currentColor" />
        </svg>
    ),
};
