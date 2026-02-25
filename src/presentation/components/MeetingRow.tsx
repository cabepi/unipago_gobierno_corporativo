import { Edit2, Download, ExternalLink, MapPin, Link as LinkIcon } from 'lucide-react';
import { Badge, type BadgeStatus } from './Badge';
import { AvatarGroup, type AvatarItem } from './AvatarGroup';

export interface MeetingRowProps {
    type: 'Reunión Ordinaria' | 'Reunión Extraordinaria';
    date: string;
    time: string;
    modality?: 'PRESENCIAL' | 'VIRTUAL';
    location?: string;
    secretaryName: string;
    secretaryRole: string;
    secretaryAvatar: string;
    participants: AvatarItem[];
    participantsOverflowLabel?: string;
    participantsOverflowColorClass?: string;
    status: BadgeStatus;
    onEdit?: () => void;
    onDownload?: () => void;
    onOpen?: () => void;
}

export function MeetingRow({
    type,
    date,
    time,
    modality,
    location,
    secretaryName,
    secretaryRole,
    secretaryAvatar,
    participants,
    participantsOverflowLabel,
    participantsOverflowColorClass,
    status,
    onEdit,
    onDownload,
    onOpen
}: MeetingRowProps) {
    const isOrdinaria = type === 'Reunión Ordinaria';

    return (
        <div className={`flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors relative group bg-white`}>
            {/* Color Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOrdinaria ? 'bg-emerald-600' : 'bg-yellow-400'}`} />

            <div className="flex-1 grid grid-cols-12 gap-4 items-center pl-8 pr-6">

                {/* Title */}
                <div className="col-span-3">
                    <h3 className="text-[17px] font-semibold text-slate-700">{type}</h3>
                </div>

                {/* Date & Time & Location */}
                <div className="col-span-2">
                    <p className="font-bold text-[15px] text-slate-700">{date}</p>
                    <p className="text-sm font-medium text-slate-400">Hora: {time}</p>

                    {modality && (
                        <div className="flex items-center gap-1.5 mt-1">
                            {modality === 'PRESENCIAL' ? (
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className="text-xs font-semibold text-slate-500 truncate max-w-[120px]" title={location || 'Ubicación no especificada'}>
                                {location ? location : 'No especificada'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Secretary Info */}
                <div className="col-span-3 flex items-center gap-3">
                    <img src={secretaryAvatar} alt={secretaryName} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-[15px] text-slate-700 leading-tight">{secretaryName}</p>
                        <p className="text-sm font-medium text-slate-400">{secretaryRole}</p>
                    </div>
                </div>

                {/* Participants */}
                <div className="col-span-2 flex justify-center">
                    <AvatarGroup
                        avatars={participants}
                        overflowLabel={participantsOverflowLabel}
                        overflowColorClass={participantsOverflowColorClass}
                    />
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center justify-start xl:justify-center">
                    <Badge status={status} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pr-6">
                {onEdit && (
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit2 className="w-5 h-5" />
                    </button>
                )}
                {onDownload && (
                    <button onClick={(e) => { e.stopPropagation(); onDownload(); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Download className="w-5 h-5" />
                    </button>
                )}
                {onOpen && (
                    <button onClick={(e) => { e.stopPropagation(); onOpen(); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                    </button>
                )}
                {/* Maintain spacing if an action is missing */}
                {!onEdit && <div className="w-5 h-5" />}
                {!onDownload && <div className="w-5 h-5" />}
            </div>
        </div>
    );
}
