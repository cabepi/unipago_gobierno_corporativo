export interface AvatarItem {
    id: string;
    src: string;
    alt: string;
}

interface AvatarGroupProps {
    avatars: AvatarItem[];
    overflowLabel?: string;
    overflowColorClass?: string;
    className?: string;
}

export function AvatarGroup({ avatars, overflowLabel, overflowColorClass = 'bg-emerald-600', className = '' }: AvatarGroupProps) {
    return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
            <div className="flex -space-x-3">
                {avatars.map((avatar) => (
                    <img
                        key={avatar.id}
                        src={avatar.src}
                        alt={avatar.alt}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                ))}

                {overflowLabel && (
                    <div className={`w-10 h-10 rounded-full ${overflowColorClass} text-white text-xs font-bold flex items-center justify-center border-2 border-white z-10`}>
                        {overflowLabel}
                    </div>
                )}
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide">
                Participantes
            </span>
        </div>
    );
}
