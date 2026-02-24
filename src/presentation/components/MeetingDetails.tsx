import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './Badge';
import { SignatureModal } from './SignatureModal';
import type { MeetingData } from '../pages/Home';

interface MeetingDetailsProps {
    meeting: MeetingData;
    onBack: () => void;
}

export function MeetingDetails({ meeting, onBack }: MeetingDetailsProps) {
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [meetingDetails, setMeetingDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const isOrdinaria = meeting.type === 'Reunión Ordinaria' || meeting.type === 'Ordinaria';

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/meeting?id=${meeting.id}`);
                const data = await res.json();
                setMeetingDetails(data);
            } catch (error) {
                console.error('Error fetching meeting details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [meeting.id]);

    const handleDownload = (filename: string) => {
        // Create a dummy blob representing the file content
        const content = `Este es un documento simulado.\nNombre original: ${filename}\nReunión: ${meeting.type}\nFecha: ${meeting.date}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        // Append to body, click, and clean up
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmittingComment(true);
        try {
            // MOCK logged in user ID since we don't have auth state in context right now, we use a valid UUID from DB seed
            const mockUserId = 'ea912a76-2f08-41df-a5e7-2b0e77d33d73'; // Laura from seed

            const res = await fetch('/api/meeting/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meetingId: meeting.id,
                    userId: mockUserId,
                    comment: newComment
                })
            });

            if (res.ok) {
                // Refresh meeting details
                const detailRes = await fetch(`/api/meeting?id=${meeting.id}`);
                const data = await detailRes.json();
                setMeetingDetails(data);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="w-full bg-white animate-in slide-in-from-right-4 duration-300 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6 px-8 pt-8 relative">
                <div className="flex items-center gap-6">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    {/* Color indicator that matches row */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOrdinaria ? 'bg-emerald-600' : 'bg-yellow-400'}`} />

                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Reunión {meeting.type}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            {meeting.date} a las <span className="text-slate-700 font-bold">{meeting.time}</span>
                        </p>
                    </div>
                </div>

                <Badge status={meetingDetails?.status || meeting.status} />
            </div>

            {isLoading ? (
                <div className="p-12 flex justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="p-8">
                    {/* Action Banner */}
                    <div className="bg-[#FFFDF0] border border-yellow-200 rounded-lg p-4 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-[15px]">Necesitamos de su Firma</p>
                                <p className="text-sm text-slate-500">Por favor firme los documentos pendientes haciendo click en el siguiente botón</p>
                                {signatureImage && (
                                    <p className="text-xs text-emerald-600 font-bold mt-1">¡Firma registrada exitosamente!</p>
                                )}
                            </div>
                        </div>
                        {signatureImage ? (
                            <div className="bg-white border border-gray-200 rounded p-1 w-24 h-12 flex items-center justify-center">
                                <img src={signatureImage} alt="Firma" className="max-h-full max-w-full object-contain" />
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsSignatureModalOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded transition-colors text-sm shadow-sm"
                            >
                                Firmar
                            </button>
                        )}
                    </div>

                    {/* 3 Columns Grid */}
                    <div className="grid grid-cols-12 gap-8">

                        {/* Column 1: Agenda and Comments */}
                        <div className="col-span-12 lg:col-span-6 pr-4">
                            <div className="mb-8">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-4">Agenda de la Reunión</h3>
                                <div className="space-y-3">
                                    {meetingDetails?.agenda?.map((topic: any, index: number) => (
                                        <div key={topic.id} className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{topic.title}</p>
                                                <p className="text-xs text-slate-500 mt-1">Duración estimada: {topic.durationMinutes} min</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!meetingDetails?.agenda || meetingDetails.agenda.length === 0) && (
                                        <p className="text-sm text-slate-500 italic">No hay temas en la agenda.</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-4">Comentarios Previos</h3>
                                <div className="space-y-4 mb-4">
                                    {meetingDetails?.comments?.map((c: any) => (
                                        <div key={c.id} className="flex gap-3">
                                            <img src={c.authorAvatar} alt={c.authorName} className="w-8 h-8 rounded-full shadow-sm" />
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-700">{c.authorName}</span>
                                                    <span className="text-[10px] text-slate-400">{c.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{c.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!meetingDetails?.comments || meetingDetails.comments.length === 0) && (
                                        <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg">No hay comentarios aún.</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Agregue un comentario o consulta sobre la agenda..."
                                        className="w-full text-sm border border-gray-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[80px]"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={isSubmittingComment || !newComment.trim()}
                                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors"
                                        >
                                            {isSubmittingComment ? 'Enviando...' : 'Enviar Comentario'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Participants */}
                        <div className="col-span-12 lg:col-span-3">
                            <h3 className="font-bold text-slate-800 text-[15px] mb-4">Participantes</h3>
                            <div className="space-y-4">
                                {/* Secretary first */}
                                {meetingDetails?.secretary && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                        <div className="flex items-center gap-3">
                                            <img src={meetingDetails.secretary.avatarUrl} alt="Secretary" className="w-8 h-8 rounded-full border border-gray-100" />
                                            <span className="text-sm font-bold text-slate-700">{meetingDetails.secretary.name}</span>
                                        </div>
                                        <Badge status="PRESENTE" className="text-[10px] px-2 py-0.5" />
                                    </div>
                                )}

                                {/* Rest of participants */}
                                {meetingDetails?.participantsList?.map((p: any) => (
                                    <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed last:border-0">
                                        <div className={`flex items-center gap-3 ${p.status === 'AUSENTE' ? 'opacity-60' : ''}`}>
                                            <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full border border-gray-100" />
                                            <span className="text-sm font-bold text-slate-700">{p.name}</span>
                                        </div>
                                        <Badge status={p.status} className="text-[10px] px-2 py-0.5" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 3: Documents */}
                        <div className="col-span-12 lg:col-span-3">
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-4">Documentos Anexos</h3>

                                <div className="space-y-6">
                                    {/* Support Documents & Presentations */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Previo a Reunión</h4>
                                        <div className="space-y-3">
                                            {meetingDetails?.documents?.filter((d: any) => d.category !== 'ACTA').map((doc: any) => (
                                                <div
                                                    key={doc.id}
                                                    onClick={() => handleDownload(doc.name)}
                                                    className="flex items-start gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                                                >
                                                    <div className="w-10 h-12 bg-gray-100 rounded-md flex flex-col justify-end overflow-hidden relative border border-gray-200 shadow-sm shrink-0">
                                                        <div className="absolute top-0 right-0 w-2 h-2 bg-white border-l border-b border-gray-200"></div>
                                                        <div className={`text-white text-[8px] font-bold text-center py-0.5 ${doc.type === 'PDF' ? 'bg-red-500' : doc.type === 'PPTX' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                                            {doc.type}
                                                        </div>
                                                    </div>
                                                    <div className="pt-0.5">
                                                        <p className="font-bold text-xs text-slate-700 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{doc.name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{doc.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {meetingDetails?.documents?.filter((d: any) => d.category !== 'ACTA').length === 0 && (
                                                <p className="text-xs text-slate-400 italic">No hay documentos de soporte.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actas */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Actas</h4>
                                        <div className="space-y-3">
                                            {meetingDetails?.documents?.filter((d: any) => d.category === 'ACTA').map((doc: any) => (
                                                <div
                                                    key={doc.id}
                                                    onClick={() => handleDownload(doc.name)}
                                                    className="flex items-start gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                                                >
                                                    <div className="w-10 h-12 bg-emerald-50 rounded-md flex flex-col justify-end overflow-hidden relative border border-emerald-200 shadow-sm shrink-0">
                                                        <div className="absolute top-0 right-0 w-2 h-2 bg-white border-l border-b border-emerald-200"></div>
                                                        <div className={`text-white text-[8px] font-bold text-center py-0.5 bg-emerald-500`}>
                                                            {doc.type}
                                                        </div>
                                                    </div>
                                                    <div className="pt-0.5">
                                                        <p className="font-bold text-xs text-slate-700 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">{doc.name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{doc.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {meetingDetails?.documents?.filter((d: any) => d.category === 'ACTA').length === 0 && (
                                                <p className="text-xs text-slate-400 italic">El acta no ha sido generada.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            <SignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onSign={async (dataUrl) => {
                    // MOCK logged in user ID since we don't have auth state in context right now, we use a valid UUID from DB seed
                    const mockUserId = 'ea912a76-2f08-41df-a5e7-2b0e77d33d73'; // Laura from seed
                    const docId = meetingDetails?.documents?.[0]?.id; // sign first document as mock behavior

                    if (docId) {
                        try {
                            await fetch('/api/signatures', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    documentId: docId,
                                    userId: mockUserId,
                                    signatureBase64: dataUrl
                                })
                            });
                        } catch (err) {
                            console.error('Error saving signature', err);
                        }
                    }

                    setSignatureImage(dataUrl);
                    setIsSignatureModalOpen(false);
                }}
            />
        </div>
    );
}
