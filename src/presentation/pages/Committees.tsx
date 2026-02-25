import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Users, ExternalLink } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { CommitteeFormModal } from '../components/CommitteeFormModal';
import { AvatarGroup } from '../components/AvatarGroup';

export interface CommitteeRole {
    userId: string;
    role: 'Secretario' | 'Soporte' | 'Miembro';
}

export interface Committee {
    id: string;
    name: string;
    type: 'Interno' | 'Externo';
    description: string;
    members: CommitteeRole[];
    createdAt: string;
}



export function Committees() {
    const navigate = useNavigate();
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchCommittees = async () => {
        try {
            const res = await fetch('/api/committees');
            const data = await res.json();
            setCommittees(data);
        } catch (error) {
            console.error('Error fetching committees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommittees();
    }, []);

    const handleCreateCommittee = () => {
        // Refetch fully to get correct nested user info right away from DB
        fetchCommittees();
        setIsCreateModalOpen(false);
    };

    const filteredCommittees = committees.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to render avatars for a committee
    const renderMembersAvatars = (membersRoles: any[]) => {
        const avatars = membersRoles.filter(mr => mr.user).map((mr, idx) => ({
            id: mr.userId || `member-${idx}`,
            src: mr.user.avatarUrl || '',
            alt: mr.user.name || ''
        }));

        return (
            <AvatarGroup
                avatars={avatars.slice(0, 4)}
                overflowLabel={avatars.length > 4 ? `+${avatars.length - 4}` : undefined}
                overflowColorClass="bg-slate-100 text-slate-600 border-white"
            />
        );
    };

    return (
        <div className="p-4 md:p-8 w-full font-sans max-w-7xl mx-auto">
            <main className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[80vh]">

                {/* Header Sub-Nav */}
                <header className="px-8 pt-8 pb-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Directorio de Comités</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Gestione los comités internos y externos de la organización</p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Crear Comité
                    </button>
                </header>

                {/* Toolbar */}
                <div className="px-8 py-4 bg-slate-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar comités..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium placeholder:font-normal"
                        />
                    </div>
                </div>

                {/* Committees Grid */}
                <div className="p-8">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-bold text-slate-500">Cargando comités...</h3>
                        </div>
                    ) : filteredCommittees.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-slate-700">No se encontraron comités</h3>
                            <p className="text-slate-500 text-sm mt-1">Intente con otro término de búsqueda o cree un nuevo comité.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCommittees.map(committee => (
                                <Card
                                    key={committee.id}
                                    onClick={() => navigate(`/committees/${committee.id}`)}
                                    className="flex flex-col h-full group hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                                >
                                    {/* Color Indicator */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${committee.type === 'Interno' ? 'bg-indigo-500' : 'bg-orange-400'}`} />

                                    <div className="pl-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <Badge status={committee.type === 'Interno' ? 'PENDIENTE' : 'PENDIENTE FIRMA'} />
                                            {/* We borrow the badge styles to represent the type colors. PENDIENTE is grey/blueish, PENDIENTE FIRMA is orange */}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${committee.type === 'Interno' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {committee.type.toUpperCase()}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">{committee.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
                                            {committee.description}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Membros ({committee.members.length})</span>
                                                {renderMembersAvatars(committee.members)}
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

            </main >

            <CommitteeFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateCommittee}
            />
        </div >
    );
}
