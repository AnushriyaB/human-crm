import React from 'react';
import {
    Smile,
    MapPin,
    Phone,
    Heart,
    Briefcase,
    Calendar,
    Gift,
    Image as ImageIcon,
    MessageSquare,
    User,
    Link,
    Settings
} from 'lucide-react';

export const Icons = {
    Basics: ({ className }) => <User className={className} strokeWidth={1.5} />,
    Face: ({ className }) => <ImageIcon className={className} strokeWidth={1.5} />,
    Contact: ({ className }) => <Phone className={className} strokeWidth={1.5} />,
    Coordinates: ({ className }) => <MapPin className={className} strokeWidth={1.5} />,
    Vibe: ({ className }) => <Smile className={className} strokeWidth={1.5} />,
    ExtraLove: ({ className }) => <Heart className={className} strokeWidth={1.5} />,
    Gift: ({ className }) => <Gift className={className} strokeWidth={1.5} />,
    Briefcase: ({ className }) => <Briefcase className={className} strokeWidth={1.5} />,
    Calendar: ({ className }) => <Calendar className={className} strokeWidth={1.5} />,
    Notes: ({ className }) => <MessageSquare className={className} strokeWidth={1.5} />,
    Eye: ({ className }) => <span className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></span>,
    Coffee: ({ className }) => <span className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" /></svg></span>,
    Sparkles: ({ className }) => <span className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 5h4" /><path d="M3 9h4" /></svg></span>,
    Image: ({ className }) => <ImageIcon className={className} strokeWidth={1.5} />,
    Link: ({ className }) => <Link className={className} strokeWidth={1.5} />,
    Settings: ({ className }) => <Settings className={className} strokeWidth={1.5} />,
};
