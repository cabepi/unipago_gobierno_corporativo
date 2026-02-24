import { useState } from 'react';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { MeetingRow } from '../components/MeetingRow';
import { MeetingDetails } from '../components/MeetingDetails';
import type { AvatarItem } from '../components/AvatarGroup';
import type { BadgeStatus } from '../components/Badge';

export interface MeetingData {
    id: string;
    type: 'Ordinaria' | 'Extraordinaria';
    date: string;
    time: string;
    secretary: {
        name: string;
        avatarUrl: string;
    };
    participants: {
        avatars: AvatarItem[];
        overflowLabel?: string;
        overflowColorClass?: string;
    };
    status: BadgeStatus;
}

// --- MOCK DATA ---
const PENDIENTES_DATA: MeetingData[] = [
    {
        id: 'p1',
        type: 'Ordinaria',
        date: 'Febrero 20, 2024',
        time: '12:00 m',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=1', alt: 'P1' }] },
        status: 'PENDIENTE'
    },
    {
        id: 'p2',
        type: 'Extraordinaria',
        date: 'Febrero 25, 2024',
        time: '04:00 pm',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=2', alt: 'P2' }] },
        status: 'PENDIENTE'
    }
];

const PROXIMAS_DATA: MeetingData[] = [
    {
        id: 'pr1',
        type: 'Ordinaria',
        date: 'Marzo 12, 2024',
        time: '12:00 m',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: {
            avatars: [
                { id: '1', src: 'https://i.pravatar.cc/150?img=3', alt: 'P3' },
                { id: '2', src: 'https://i.pravatar.cc/150?img=4', alt: 'P4' }
            ],
            overflowLabel: '+10',
            overflowColorClass: 'bg-emerald-600'
        },
        status: 'EN PROCESO'
    },
    {
        id: 'pr2',
        type: 'Extraordinaria',
        date: 'Marzo 26, 2024',
        time: '10:00 am',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: {
            avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=5', alt: 'P5' }],
            overflowLabel: 'S',
            overflowColorClass: 'bg-red-500'
        },
        status: 'PENDIENTE'
    },
    {
        id: 'pr3',
        type: 'Extraordinaria',
        date: 'Abril 05, 2024',
        time: '02:00 pm',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=6', alt: 'P6' }] },
        status: 'PENDIENTE'
    },
    {
        id: 'pr4',
        type: 'Ordinaria',
        date: 'Abril 15, 2024',
        time: '11:00 am',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=7', alt: 'P7' }] },
        status: 'PENDIENTE'
    },
    {
        id: 'pr5',
        type: 'Ordinaria',
        date: 'Mayo 02, 2024',
        time: '09:00 am',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=8', alt: 'P8' }] },
        status: 'PENDIENTE'
    }
];

const PASADAS_DATA: MeetingData[] = [
    {
        id: 'pa1',
        type: 'Ordinaria',
        date: 'Enero 12, 2024',
        time: '12:00 m',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=9', alt: 'P9' }] },
        status: 'finalizada'
    },
    {
        id: 'pa2',
        type: 'Extraordinaria',
        date: 'Diciembre 20, 2023',
        time: '03:00 pm',
        secretary: { name: 'Yudelka Roberts', avatarUrl: 'https://i.pravatar.cc/150?u=yudelka' },
        participants: { avatars: [{ id: '1', src: 'https://i.pravatar.cc/150?img=10', alt: 'P10' }] },
        status: 'cancelada'
    }
];

export default function Home() {
    const [activeTab, setActiveTab] = useState('proximas');
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingData | null>(null);

    const getCurrentMeetings = () => {
        if (activeTab === 'pendientes') return PENDIENTES_DATA;
        if (activeTab === 'proximas') return PROXIMAS_DATA;
        return PASADAS_DATA;
    };

    const handleRowDownload = (meeting: MeetingData) => {
        const filename = `Documentos_Reunion_${meeting.type.replace(/\s+/g, '_')}_${meeting.date.replace(/[\s,]+/g, '_')}.zip`;
        const content = `Archivo ZIP simulado.\nReunión: ${meeting.type}\nFecha: ${meeting.date}`;
        const blob = new Blob([content], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const currentMeetings = getCurrentMeetings();

    return (
        <div className="p-4 md:p-8 w-full font-sans max-w-7xl mx-auto">
            <main className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden" data-purpose="dashboard-container">
                {selectedMeeting ? (
                    <MeetingDetails meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />
                ) : (
                    <>
                        {/* Header Section */}
                        <header className="px-8 pt-8 pb-4 border-b border-gray-100" data-purpose="main-header">
                            <h1 className="text-xl font-bold text-slate-800">Unipago S.A</h1>
                        </header>

                        {/* Summary Cards Section */}
                        <section className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6" data-purpose="summary-cards">
                            <Card className="flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-slate-800">25</p>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Total de Actas</p>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                                    </svg>
                                </div>
                            </Card>

                            <Card className="flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-slate-800">1</p>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Pendientes de Firma</p>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                                    </svg>
                                </div>
                            </Card>

                            <Card variant="primary-action">
                                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                                <p className="text-sm font-bold">Ver Actas Pendientes</p>
                                <p className="text-xs opacity-90">1 acta pendiente</p>
                            </Card>
                        </section>

                        {/* Navigation and Quick Actions */}
                        <section className="px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4" data-purpose="navigation-section">
                            <Tabs
                                activeTabId={activeTab}
                                onTabChange={setActiveTab}
                                tabs={[
                                    { id: 'pendientes', label: 'Pendientes de Firma', count: 2 },
                                    { id: 'proximas', label: 'Próximas Reuniones', count: 5 },
                                    { id: 'pasadas', label: 'Reuniones Pasadas', count: 33 }
                                ]}
                            />

                            {/* Teams Quick Action Card */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center space-x-4 shadow-sm" data-purpose="teams-shortcut">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <svg className="w-8 h-8 text-[#4B53BC]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.5 13.5v-7.5l-4 3.25L4.5 6v7.5l4-3.25L12.5 13.5z M18 17.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z M18 10a2 2 0 100-4 2 2 0 000 4z"></path>
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm font-bold text-slate-800">Unirse a Teams</span>
                                        <span className="text-xs font-semibold text-slate-600">09:00 am</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500">Jueves 03 de Marzo 2023</span>
                                </div>
                            </div>
                        </section>

                        {/* Filter Bar */}
                        <section className="px-8 py-6 flex gap-8 text-xs font-medium text-gray-500 border-b border-gray-50" data-purpose="filter-bar">
                            <div className="flex items-center gap-2">
                                <span>Tipo</span>
                                <button className="flex items-center gap-1 text-slate-800 font-semibold">
                                    Ver todo
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Estado</span>
                                <button className="flex items-center gap-1 text-slate-800 font-semibold">
                                    Ver todo
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                </button>
                            </div>
                        </section>

                        {/* Meeting List Section */}
                        <section className="px-8 pb-8" data-purpose="meeting-list">
                            {currentMeetings.map((meeting) => (
                                <div key={meeting.id} onClick={() => setSelectedMeeting(meeting)} className="cursor-pointer">
                                    <MeetingRow
                                        type={meeting.type === 'Ordinaria' ? 'Reunión Ordinaria' : 'Reunión Extraordinaria'}
                                        date={meeting.date}
                                        time={meeting.time}
                                        secretaryName={meeting.secretary.name}
                                        secretaryRole="Secretario"
                                        secretaryAvatar={meeting.secretary.avatarUrl}
                                        participants={meeting.participants.avatars}
                                        participantsOverflowLabel={meeting.participants.overflowLabel}
                                        participantsOverflowColorClass={meeting.participants.overflowColorClass}
                                        status={meeting.status}
                                        onEdit={() => console.log('Edit', meeting.id)}
                                        onDownload={() => handleRowDownload(meeting)}
                                        onOpen={() => console.log('Open', meeting.id)}
                                    />
                                </div>
                            ))}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
