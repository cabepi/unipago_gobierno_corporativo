import { ChevronDown } from 'lucide-react';
import { MeetingRow } from '../components/MeetingRow';

export default function Dashboard() {
    // Dummy Data to match the design
    const meetings: any[] = [
        {
            id: '1',
            type: 'Reunión Ordinaria',
            date: 'Febrero 12, 2023',
            time: '12:00 m',
            secretaryName: 'Yudelka Roberts',
            secretaryRole: 'Secretario',
            secretaryAvatar: 'https://i.pravatar.cc/150?u=yudelka',
            participants: [
                { id: 'p1', src: 'https://i.pravatar.cc/150?img=1', alt: 'Part A' },
                { id: 'p2', src: 'https://i.pravatar.cc/150?img=2', alt: 'Part B' },
                { id: 'p3', src: 'https://i.pravatar.cc/150?img=3', alt: 'Part C' },
            ],
            participantsOverflowLabel: '+10',
            participantsOverflowColorClass: 'bg-emerald-600',
            status: 'EN PROCESO',
            hasEdit: true,
            hasDownload: true,
            hasOpen: true
        },
        {
            id: '2',
            type: 'Reunión Extraordinaria',
            date: 'Febrero 26, 2023',
            time: '05:00 pm',
            secretaryName: 'Yudelka Roberts',
            secretaryRole: 'Secretario',
            secretaryAvatar: 'https://i.pravatar.cc/150?u=yudelka',
            participants: [
                { id: 'p4', src: 'https://i.pravatar.cc/150?img=4', alt: 'Part D' },
                { id: 'p5', src: 'https://i.pravatar.cc/150?img=5', alt: 'Part E' },
            ],
            status: 'PENDIENTE',
            hasEdit: true,
            hasDownload: true,
            hasOpen: true
        },
        {
            id: '3',
            type: 'Reunión Extraordinaria',
            date: 'Marzo 03, 2023',
            time: '10:00 am',
            secretaryName: 'Yudelka Roberts',
            secretaryRole: 'Secretario',
            secretaryAvatar: 'https://i.pravatar.cc/150?u=yudelka',
            participants: [
                { id: 'p6', src: 'https://i.pravatar.cc/150?img=6', alt: 'Part F' },
                { id: 'p7', src: 'https://i.pravatar.cc/150?img=7', alt: 'Part G' },
            ],
            participantsOverflowLabel: 'S',
            participantsOverflowColorClass: 'bg-red-500',
            status: 'PENDIENTE',
            hasOpen: true
        },
        {
            id: '4',
            type: 'Reunión Ordinaria',
            date: 'Marzo 12, 2023',
            time: '12:00 m',
            secretaryName: 'Yudelka Roberts',
            secretaryRole: 'Secretario',
            secretaryAvatar: 'https://i.pravatar.cc/150?u=yudelka',
            participants: [
                { id: 'p8', src: 'https://i.pravatar.cc/150?img=8', alt: 'Part H' },
                { id: 'p9', src: 'https://i.pravatar.cc/150?img=9', alt: 'Part I' },
            ],
            participantsOverflowLabel: 'S',
            participantsOverflowColorClass: 'bg-red-500',
            status: 'PENDIENTE',
        },
        {
            id: '5',
            type: 'Reunión Ordinaria',
            date: 'Abril 12, 2023',
            time: '12:00 m',
            secretaryName: 'Yudelka Roberts',
            secretaryRole: 'Secretario',
            secretaryAvatar: 'https://i.pravatar.cc/150?u=yudelka',
            participants: [
                { id: 'p10', src: 'https://i.pravatar.cc/150?img=10', alt: 'Part J' },
                { id: 'p11', src: 'https://i.pravatar.cc/150?img=11', alt: 'Part K' },
                { id: 'p12', src: 'https://i.pravatar.cc/150?img=12', alt: 'Part L' },
            ],
            participantsOverflowLabel: '+3',
            participantsOverflowColorClass: 'bg-emerald-600',
            status: 'PENDIENTE',
        },
        {
            id: '6',
            type: 'Reunión Extraordinaria',
            date: 'Abril 21, 2023',
            time: '06:00 pm',
            secretaryName: 'Yudelka Roberts',
            secretaryRole: 'Secretario',
            secretaryAvatar: 'https://i.pravatar.cc/150?u=yudelka',
            participants: [
                { id: 'p13', src: 'https://i.pravatar.cc/150?img=13', alt: 'Part M' },
                { id: 'p14', src: 'https://i.pravatar.cc/150?img=14', alt: 'Part N' },
                { id: 'p15', src: 'https://i.pravatar.cc/150?img=15', alt: 'Part O' },
            ],
            participantsOverflowLabel: 'A',
            participantsOverflowColorClass: 'bg-purple-600',
            status: 'PENDIENTE',
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-[1400px] mx-auto p-8">
                {/* Filters Header */}
                <div className="flex items-center gap-8 mb-6 text-[15px]">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">Tipo</span>
                        <button className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900">
                            Ver todo <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">Estado</span>
                        <button className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900">
                            Ver todo <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Meetings List */}
                <div className="border-t border-slate-100 flex flex-col">
                    {meetings.map((meeting) => (
                        <MeetingRow
                            key={meeting.id}
                            type={meeting.type}
                            date={meeting.date}
                            time={meeting.time}
                            secretaryName={meeting.secretaryName}
                            secretaryRole={meeting.secretaryRole}
                            secretaryAvatar={meeting.secretaryAvatar}
                            participants={meeting.participants}
                            participantsOverflowLabel={meeting.participantsOverflowLabel}
                            participantsOverflowColorClass={meeting.participantsOverflowColorClass}
                            status={meeting.status}
                            onEdit={meeting.hasEdit ? () => console.log('Edit', meeting.id) : undefined}
                            onDownload={meeting.hasDownload ? () => console.log('Download', meeting.id) : undefined}
                            onOpen={meeting.hasOpen ? () => console.log('Open', meeting.id) : undefined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
