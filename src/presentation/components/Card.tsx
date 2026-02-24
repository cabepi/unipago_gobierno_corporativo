import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'primary-action';
    className?: string;
    onClick?: () => void;
}

export function Card({ children, variant = 'default', className = '', onClick }: CardProps) {
    if (variant === 'primary-action') {
        return (
            <button
                onClick={onClick}
                className={`bg-[#f15a24] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-white transition-transform hover:scale-[1.02] cursor-pointer ${className}`}
            >
                {children}
            </button>
        );
    }

    return (
        <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${className}`}>
            {children}
        </div>
    );
}
