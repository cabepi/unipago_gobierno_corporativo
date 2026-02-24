import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { MeetingRow } from '../components/MeetingRow';
import { MeetingDetails } from '../components/MeetingDetails';
import type { AvatarItem } from '../components/AvatarGroup';
import type { BadgeStatus } from '../components/Badge';

export interface MeetingData {
    id: string;
    type: 'Ordinaria' | 'Extraordinaria' | string;
    date: string;
    time: string;
    location: string;
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

// Enums/Status handled dynamically through API response now


export default function Home() {
    const [activeTab, setActiveTab] = useState('proximas');
    const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);
    const [meetings, setMeetings] = useState<MeetingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMeetings = async () => {
        try {
            const res = await fetch('/api/meetings');
            const data = await res.json();

            // Map the API data array of participants to AvatarItem array structurally
            const mappedData: MeetingData[] = data.map((m: any) => ({
                ...m,
                participants: {
                    ...m.participants,
                    avatars: m.participants.list?.map((p: any, idx: number) => ({
                        id: `p-${idx}`,
                        src: p.url,
                        alt: p.name
                    })) || []
                }
            }));

            setMeetings(mappedData);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const getCurrentMeetings = () => {
        if (activeTab === 'pendientes') return meetings.filter(m => m.status === 'PENDIENTE FIRMA');
        if (activeTab === 'proximas') return meetings.filter(m => m.status === 'PENDIENTE' || m.status === 'EN PROCESO');
        return meetings.filter(m => ['FINALIZADA', 'CANCELADA'].includes(m.status.toUpperCase()));
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
                                    <p className="text-4xl font-bold text-slate-800">{meetings.length}</p>
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
                                    <p className="text-4xl font-bold text-slate-800">{meetings.filter(m => m.status === 'PENDIENTE FIRMA').length}</p>
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
                                <p className="text-xs opacity-90">{meetings.filter(m => m.status === 'PENDIENTE FIRMA').length} actas pendientes</p>
                            </Card>
                        </section>

                        {/* Navigation and Quick Actions */}
                        <section className="px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4" data-purpose="navigation-section">
                            <Tabs
                                activeTabId={activeTab}
                                onTabChange={setActiveTab}
                                tabs={[
                                    { id: 'pendientes', label: 'Pendientes de Firma', count: meetings.filter(m => m.status === 'PENDIENTE FIRMA').length },
                                    { id: 'proximas', label: 'Próximas Reuniones', count: meetings.filter(m => m.status === 'PENDIENTE' || m.status === 'EN PROCESO').length },
                                    { id: 'pasadas', label: 'Reuniones Pasadas', count: meetings.filter(m => ['FINALIZADA', 'CANCELADA'].includes(m.status.toUpperCase())).length }
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
                            {isLoading ? (
                                <div className="py-12 text-center text-slate-500 font-medium">Cargando actas...</div>
                            ) : currentMeetings.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 font-medium">No hay actas disponibles en esta pestaña.</div>
                            ) : currentMeetings.map((meeting) => (
                                <div key={meeting.id} onClick={() => setSelectedMeeting(meeting)} className="cursor-pointer">
                                    <MeetingRow
                                        type={meeting.type as 'Reunión Ordinaria' | 'Reunión Extraordinaria'}
                                        date={meeting.date}
                                        time={meeting.time}
                                        secretaryName={meeting.secretary?.name || 'Por Asignar'}
                                        secretaryRole="Secretario"
                                        secretaryAvatar={meeting.secretary?.avatarUrl || ''}
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
