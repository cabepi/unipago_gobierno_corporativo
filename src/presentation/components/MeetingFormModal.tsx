import { useState } from 'react';
import { X } from 'lucide-react';

interface MeetingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { date: string; time: string; location: string; type: 'Ordinaria' | 'Extraordinaria' }) => void;
}

export function MeetingFormModal({ isOpen, onClose, onSubmit }: MeetingFormModalProps) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState<'Ordinaria' | 'Extraordinaria'>('Ordinaria');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ date, time, location, type });
        // Reset form
        setDate('');
        setTime('');
        setLocation('');
        setType('Ordinaria');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Agendar Nueva Reunión</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="meeting-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Tipo de Reunión
                                </label>
                                <select
                                    required
                                    value={type}
                                    onChange={(e) => setType(e.target.value as 'Ordinaria' | 'Extraordinaria')}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white text-slate-800"
                                >
                                    <option value="Ordinaria">Ordinaria</option>
                                    <option value="Extraordinaria">Extraordinaria</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Lugar / Enlace (Teams, Zoom, etc.)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej. Sala de Juntas B o enlace web"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="meeting-form"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-[#f15a24] rounded-lg hover:bg-[#d94a1a] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f15a24]/50 focus:ring-offset-2"
                    >
                        Agendar Reunión
                    </button>
                </div>
            </div>
        </div>
    );
}
