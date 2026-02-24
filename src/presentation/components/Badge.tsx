import type { ReactNode } from 'react';

export type BadgeStatus = 'finalizada' | 'cancelada' | 'EN PROCESO' | 'PENDIENTE' | 'PENDIENTE FIRMA' | 'PRESENTE' | 'AUSENTE';

interface BadgeProps {
    status: BadgeStatus;
    children?: ReactNode;
    className?: string;
}

export function Badge({ status, children, className = '' }: BadgeProps) {
    let statusClass = '';

    switch (status) {
        case 'finalizada':
            statusClass = 'bg-stone-100 text-stone-600';
            break;
        case 'cancelada':
            statusClass = 'bg-red-100 text-red-600';
            break;
        case 'EN PROCESO':
            statusClass = 'bg-blue-50 text-blue-500 font-bold';
            break;
        case 'PENDIENTE':
            statusClass = 'bg-slate-100 text-slate-500 font-bold';
            break;
        case 'PENDIENTE FIRMA':
            statusClass = 'bg-orange-100/50 text-orange-500 font-bold';
            break;
        case 'PRESENTE':
            statusClass = 'bg-emerald-50 text-emerald-600 font-bold';
            break;
        case 'AUSENTE':
            statusClass = 'bg-red-50 text-red-500 font-bold';
            break;
    }

    return (
        <span className={`px-3 py-1.5 rounded inline-block uppercase text-center text-xs tracking-wider ${statusClass} ${className}`}>
            {children || status}
        </span>
    );
}
