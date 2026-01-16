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
    User
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
};
