import { useState, useEffect } from 'react';
import { X, ShieldAlert, Check, Loader2 } from 'lucide-react';
import type { Committee, CommitteeRole } from '../pages/Committees';

interface CommitteeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (committee: Omit<Committee, 'id' | 'createdAt'>) => void;
}

export function CommitteeFormModal({ isOpen, onClose, onSubmit }: CommitteeFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Interno' | 'Externo'>('Interno');
    const [members, setMembers] = useState<CommitteeRole[]>([]);
    const [searchUser, setSearchUser] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [usersList, setUsersList] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && usersList.length === 0) {
            fetch('/api/users')
                .then(res => res.json())
                .then(data => setUsersList(data))
                .catch(err => console.error('Error fetching users:', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const hasSecretary = members.some(m => m.role === 'Secretario');

    const handleAddMember = (userId: string, isExternal: boolean) => {
        if (type === 'Interno' && isExternal) {
            setError('Los comités internos solo pueden tener miembros internos de la organización.');
            return;
        }
        setError('');
        // Add member with default role 'Miembro'
        if (!members.find(m => m.userId === userId)) {
            setMembers([...members, { userId, role: 'Miembro' }]);
        }
        setSearchUser('');
    };

    const handleRemoveMember = (userId: string) => {
        setMembers(members.filter(m => m.userId !== userId));
    };

    const handleChangeRole = (userId: string, newRole: 'Secretario' | 'Soporte' | 'Miembro') => {
        if (newRole === 'Secretario' && hasSecretary && members.find(m => m.userId === userId)?.role !== 'Secretario') {
            // Unset previous secretary since there can only be one
            setMembers(members.map(m => {
                if (m.userId === userId) return { ...m, role: 'Secretario' };
                if (m.role === 'Secretario') return { ...m, role: 'Miembro' };
                return m;
            }));
            return;
        }

        setMembers(members.map(m => m.userId === userId ? { ...m, role: newRole } : m));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('El nombre del comité es requerido.');
            return;
        }
        if (!hasSecretary) {
            setError('Todo comité debe tener un Secretario asignado.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/committees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    type,
                    members
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear el comité');
            }

            const data = await response.json();

            // Re-fetch or simulate optimistic update in parent 
            // (parent should ideally re-fetch from API)
            onSubmit(data.committee);

            // Reset form
            setName('');
            setDescription('');
            setType('Interno');
            setMembers([]);
            setError('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter available users to add
    const availableUsers = usersList.filter(u =>
        !members.find(m => m.userId === u.id) &&
        u.name.toLowerCase().includes(searchUser.toLowerCase()) &&
        (type === 'Externo' || !u.isExternal) // Internal commitees exclude external users
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Comité</h2>
                        <p className="text-xs text-slate-500 mt-1">Configure los detalles y miembros del comité</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1.5 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="committee-form" onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2 border border-red-100">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700">Nombre del Comité</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej. Comité de Auditoría"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 relative"
                                    required
                                />
                            </div>

                            {/* Tipo */}
                            <div className="space-y-2 md:col-span-2 border-b border-slate-100 pb-6">
                                <label className="text-sm font-bold text-slate-700">Tipo de Acceso</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => {
                                            setType('Interno');
                                            // Auto-remove external users if switching to Internal
                                            setMembers(members.filter(m => !usersList.find(u => u.id === m.userId)?.isExternal));
                                        }}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${type === 'Interno' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${type === 'Interno' ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300'}`}>
                                            {type === 'Interno' && <Check className="w-3 h-3" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${type === 'Interno' ? 'text-indigo-900' : 'text-slate-700'}`}>Interno</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Solo tienen acceso colaboradores directos de la organización.</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setType('Externo')}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${type === 'Externo' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${type === 'Externo' ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'}`}>
                                            {type === 'Externo' && <Check className="w-3 h-3" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${type === 'Externo' ? 'text-orange-900' : 'text-slate-700'}`}>Externo</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Permite participación de personas externas, como accionistas o consultores.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700">Descripción (Opcional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Propósito u objetivo de este comité..."
                                    rows={2}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 resize-none"
                                />
                            </div>

                            {/* Integrantes */}
                            <div className="space-y-4 md:col-span-2 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        Integrantes del Comité
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${hasSecretary ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                            {hasSecretary ? 'Secretario Asignado' : 'Falta Secretario'}
                                        </span>
                                    </label>
                                </div>

                                {/* Buscador de usuarios */}
                                <div className="relative z-10">
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre para agregar..."
                                        value={searchUser}
                                        onChange={(e) => setSearchUser(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />

                                    {/* Dropdown de sugerencias */}
                                    {searchUser.trim() !== '' && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                                            {availableUsers.length > 0 ? (
                                                availableUsers.map(u => (
                                                    <div
                                                        key={u.id}
                                                        onClick={() => handleAddMember(u.id, u.isExternal)}
                                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                                                    >
                                                        <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-slate-700">{u.name}</p>
                                                            <p className="text-xs text-slate-500">{u.role}</p>
                                                        </div>
                                                        {u.isExternal && (
                                                            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-sm">EXTERNO</span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-4 text-sm text-center text-slate-500">
                                                    No se encontraron usuarios disponibles.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Lista de integrantes seleccionados */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                                    {members.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 text-sm">
                                            Aún no hay miembros asignados a este comité.
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-slate-100">
                                            {members.map(member => {
                                                const user = usersList.find(u => u.id === member.userId);
                                                if (!user) return null;

                                                return (
                                                    <li key={member.userId} className="p-3 flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors">
                                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-gray-100" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-2">
                                                                {user.name}
                                                                {user.isExternal && <span className="text-[9px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded-sm">EXT</span>}
                                                            </p>
                                                            <p className="text-xs text-slate-400 truncate">{user.role}</p>
                                                        </div>

                                                        {/* Selector de Rol en Comité */}
                                                        <div className="shrink-0 flex items-center gap-2">
                                                            <select
                                                                value={member.role}
                                                                onChange={(e) => handleChangeRole(member.userId, e.target.value as any)}
                                                                className={`text-xs font-bold px-2 py-1.5 rounded outline-none border cursor-pointer appearance-none ${member.role === 'Secretario'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                    : member.role === 'Soporte'
                                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                                    }`}
                                                            >
                                                                <option value="Miembro">Miembro</option>
                                                                <option value="Soporte">Soporte</option>
                                                                <option value="Secretario">Secretario</option>
                                                            </select>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveMember(member.userId)}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    >
                        Descartar
                    </button>
                    <button
                        type="submit"
                        form="committee-form"
                        disabled={!name.trim() || !hasSecretary || isLoading}
                        className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? 'Guardando...' : 'Confirmar Comité'}
                    </button>
                </div>

            </div>
        </div>
    );
}
