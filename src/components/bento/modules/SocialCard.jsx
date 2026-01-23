import React from 'react';
import BentoCard from '../Card';
import { Share2, Globe, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const SOCIAL_ICONS = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    website: Globe,
    default: Globe
};

export default function SocialCard({ module }) {
    const links = module.data?.links || [];

    const getIcon = (platform) => {
        const key = platform?.toLowerCase();
        return SOCIAL_ICONS[key] || SOCIAL_ICONS.default;
    };

    return (
        <BentoCard
            title="The Web"
            icon={Share2}
            className="row-span-1"
        >
            <div className="grid grid-cols-4 gap-2">
                {links.length === 0 && (
                    <div className="col-span-4 text-center py-4 text-[var(--color-text-secondary)] text-sm italic">
                        No links added yet.
                    </div>
                )}
                {links.map((link, i) => {
                    const Icon = getIcon(link.platform);
                    return (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-highlight)]/10 hover:text-[var(--color-highlight)] rounded-xl transition-all group"
                        >
                            <Icon size={20} className="mb-1" />
                            <span className="text-[9px] uppercase tracking-wide opacity-50 group-hover:opacity-100">{link.platform}</span>
                        </a>
                    );
                })}
            </div>
        </BentoCard>
    );
}
