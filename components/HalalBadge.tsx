import React from 'react';
import { HalalCertification } from '../types';

interface HalalBadgeProps {
    certification: HalalCertification;
    size?: 'sm' | 'md';
}

const BADGE_CONFIG: Record<HalalCertification, { label: string; className: string; icon: string }> = {
    muis_certified: {
        label: 'MUIS Certified',
        className: 'bg-emerald-600 text-white',
        icon: 'verified',
    },
    muslim_owned: {
        label: 'Muslim-Owned',
        className: 'bg-sky-600 text-white',
        icon: 'mosque',
    },
    self_declared: {
        label: 'Halal-Friendly',
        className: 'bg-slate-500 text-white',
        icon: 'thumb_up',
    },
};

const HalalBadge: React.FC<HalalBadgeProps> = ({ certification, size = 'md' }) => {
    const cfg = BADGE_CONFIG[certification] ?? BADGE_CONFIG.self_declared;
    const sizeClass = size === 'sm'
        ? 'text-[9px] px-2 py-0.5 gap-0.5'
        : 'text-[10px] px-2.5 py-1 gap-1';
    const iconSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${sizeClass} ${cfg.className}`}>
            <span className={`material-symbols-outlined ${iconSize}`} style={{ fontSize: 'inherit', lineHeight: 1 }}>
                {cfg.icon}
            </span>
            {cfg.label}
        </span>
    );
};

export default HalalBadge;
