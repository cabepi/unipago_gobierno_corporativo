import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AvatarGroup } from '../components/AvatarGroup';
import { MeetingRow } from '../components/MeetingRow';
import { Tabs } from '../components/Tabs';
import { MeetingFormModal } from '../components/MeetingFormModal';
import type { MeetingData } from './Home';

interface CommitteeDetailData {
    id: string;
    name: string;
    type: string;
    description: string;
    createdAt: string;
    members: any[];
    meetings: MeetingData[];
}

export function CommitteeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [committee, setCommittee] = useState<CommitteeDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('proximas');
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

    const fetchCommitteeDetail = async () => {
        if (!id) return;
        try {
            const res = await fetch(`/api/committee?id=${id}`);
            if (!res.ok) throw new Error('Failed to fetch committee');
            const data = await res.json();

            // Map participants format for MeetingRow 
            const meetingsWithAvatars = data.meetings.map((m: any) => ({
                ...m,
                participants: {
                    ...m.participants,
                    avatars: m.participants?.list?.map((p: any) => ({
                        id: p.name || `p-${Math.random()}`,
                        src: p.url,
                        alt: p.name
                    })) || []
                }
            }));

            setCommittee({ ...data, meetings: meetingsWithAvatars });
        } catch (error) {
            console.error('Error fetching committee details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommitteeDetail();
    }, [id]);

    const handleCreateMeeting = async (data: { date: string; time: string; location: string; type: string }) => {
        try {
            const res = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    committeeId: id,
                    ...data
                })
            });

            if (res.ok) {
                setIsMeetingModalOpen(false);
                fetchCommitteeDetail(); // Refresh list
            } else {
                console.error('Failed to create meeting');
            }
        } catch (error) {
            console.error('Error creating meeting:', error);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Cargando detalles del comité...</div>;
    }

    if (!committee) {
        return <div className="p-8 text-center text-red-500">Comité no encontrado.</div>;
    }

    const proximas = committee.meetings.filter(m => m.status === 'PENDIENTE' || m.status === 'EN PROCESO');
    const pendientesFirma = committee.meetings.filter(m => m.status === 'PENDIENTE FIRMA');
    const pasadas = committee.meetings.filter(m => ['FINALIZADA', 'CANCELADA'].includes(m.status.toUpperCase()));

    let currentMeetings: MeetingData[] = [];
    if (activeTab === 'proximas') currentMeetings = proximas;
    else if (activeTab === 'pendientes') currentMeetings = pendientesFirma;
    else currentMeetings = pasadas;

    return (
        <div className="p-4 md:p-8 w-full font-sans max-w-7xl mx-auto">
            <button
                onClick={() => navigate('/committees')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Volver al directorio
            </button>

            {/* Header */}
            <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge status={committee.type === 'Interno' ? 'PENDIENTE' : 'PENDIENTE FIRMA'} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${committee.type === 'Interno' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                            {committee.type.toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">{committee.name}</h1>
                    <p className="text-slate-600 max-w-3xl leading-relaxed">{committee.description}</p>
                </div>
                <div className="flex flex-col md:items-end gap-3 text-sm text-slate-500">
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-medium text-slate-700">Creado el:</span>
                        {new Date(committee.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <button
                        onClick={() => setIsMeetingModalOpen(true)}
                        className="mt-2 md:mt-0 flex items-center justify-center gap-2 bg-[#f15a24] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#cf4b1b] transition shadow-sm w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4" /> Agendar Reunión
                    </button>
                </div>
            </header >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 line-clamp-none">
                {/* Right Column: Meetings History (Takes 2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                Historial de Reuniones
                            </h2>
                        </div>

                        <div className="px-6 py-2 border-b border-gray-50 flex items-center justify-between overflow-x-auto">
                            <Tabs
                                activeTabId={activeTab}
                                onTabChange={setActiveTab}
                                tabs={[
                                    { id: 'proximas', label: 'Próximas Reuniones', count: proximas.length },
                                    { id: 'pendientes', label: 'Pendientes Firma', count: pendientesFirma.length },
                                    { id: 'pasadas', label: 'Reuniones Pasadas', count: pasadas.length }
                                ]}
                            />
                        </div>

                        <div className="p-6">
                            {currentMeetings.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 font-medium">No hay reuniones en esta pestaña para este comité.</div>
                            ) : (
                                <div className="space-y-4">
                                    {currentMeetings.map(meeting => (
                                        <MeetingRow
                                            key={meeting.id}
                                            type={meeting.type as any}
                                            date={meeting.date}
                                            time={meeting.time}
                                            secretaryName={meeting.secretary?.name || 'Por Asignar'}
                                            secretaryRole="Secretario"
                                            secretaryAvatar={meeting.secretary?.avatarUrl || ''}
                                            participants={meeting.participants.avatars}
                                            participantsOverflowLabel={meeting.participants.overflowLabel}
                                            participantsOverflowColorClass={meeting.participants.overflowColorClass}
                                            status={meeting.status}
                                            onEdit={() => { }}
                                            onDownload={() => { }}
                                            onOpen={() => { }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Left/Sidebar Column: Members */}
                <div className="space-y-6">
                    <Card className="flex flex-col">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Miembros del Comité ({committee.members.length})
                        </h2>

                        <div className="space-y-4 flex-1">
                            {committee.members.map(member => (
                                <div key={member.userId} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <img
                                        src={member.user.avatarUrl}
                                        alt={member.user.name}
                                        className="w-10 h-10 rounded-full border border-slate-200"
                                    />
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{member.user.name}</p>
                                        <p className={`text-xs font-semibold mt-0.5 ${member.role === 'Secretario' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <MeetingFormModal
                isOpen={isMeetingModalOpen}
                onClose={() => setIsMeetingModalOpen(false)}
                onSubmit={handleCreateMeeting}
            />
        </div>
    );
}
