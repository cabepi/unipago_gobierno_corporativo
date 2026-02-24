import { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
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
    const isOrdinaria = meeting.type === 'Ordinaria';

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

                <Badge status="PENDIENTE FIRMA" />
            </div>

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

                    {/* Column 1: Description Text */}
                    <div className="col-span-12 lg:col-span-6 pr-4">
                        <div className="prose prose-sm text-slate-500 prose-p:leading-relaxed">
                            <p>
                                First, a disclaimer - the entire process of writing a blog post often takes more than a couple of
                                hours, even if you ca type eighty words per minute and your writing skills are sharp. From the
                                seed of the idea to finally hitting "Publish", you might spend several days or maybe even a
                                week "writing" a blog post, but it's important to spend those vital hours planning your post
                                and even thinking about <a href="#" className="text-blue-500 no-underline hover:underline">Your Post</a> (yes, thinking counts as working if you're a blogger) before
                                you actually write it.
                            </p>
                            <p>
                                There's an old maxim that states, <strong>"No fun for the writer, no fun the reader."</strong> No matter what
                                industry you're working in, as a blogger, you should live and die by this statement.
                            </p>
                            <p>
                                Before you do any of the following steps, be sure to pick a topic that actually interests you.
                                Nothing - and <a href="#" className="text-blue-500 no-underline hover:underline font-bold">I mean NOTHING</a> - will kill a blog post more effectively than a lack of
                                enthusiasm from the writer. You can tell when a writr is bored by their subjects, and it's so
                                cringe-worthy it's a little a embarrassing.
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Participants */}
                    <div className="col-span-12 lg:col-span-3">
                        <h3 className="font-bold text-slate-800 text-[15px] mb-4">Participantes</h3>
                        <div className="space-y-4">
                            {/* Selected meeting participants + dummy data to match the image */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                <div className="flex items-center gap-3">
                                    <img src={meeting.secretary.avatarUrl} alt="Secretary" className="w-8 h-8 rounded-full border border-gray-100" />
                                    <span className="text-sm font-bold text-slate-700">{meeting.secretary.name}</span>
                                </div>
                                <Badge status="PRESENTE" className="text-[10px] px-2 py-0.5" />
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?u=ramon" alt="Ramon" className="w-8 h-8 rounded-full border border-gray-100" />
                                    <span className="text-sm font-bold text-slate-700">Ramon Rodriguez</span>
                                </div>
                                <Badge status="PRESENTE" className="text-[10px] px-2 py-0.5" />
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?u=cecilia" alt="Cecilia" className="w-8 h-8 rounded-full border border-gray-100" />
                                    <span className="text-sm font-bold text-slate-700">Cecilia Quiñonez</span>
                                </div>
                                <Badge status="PRESENTE" className="text-[10px] px-2 py-0.5" />
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?u=engels" alt="Engels" className="w-8 h-8 rounded-full border border-gray-100" />
                                    <span className="text-sm font-bold text-slate-700">Engels Santos</span>
                                </div>
                                <Badge status="PRESENTE" className="text-[10px] px-2 py-0.5" />
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?u=francis" alt="Francis" className="w-8 h-8 rounded-full border border-gray-100" />
                                    <span className="text-sm font-bold text-slate-700">Francis Mariñez</span>
                                </div>
                                <Badge status="PRESENTE" className="text-[10px] px-2 py-0.5" />
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-3 opacity-60">
                                    <img src="https://i.pravatar.cc/150?u=ingrid" alt="Ingrid" className="w-8 h-8 rounded-full border border-gray-100" />
                                    <span className="text-sm font-bold text-slate-700">Ingrid Gonzalez</span>
                                </div>
                                <Badge status="AUSENTE" className="text-[10px] px-2 py-0.5" />
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Documents */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="mb-6">
                            <h3 className="font-bold text-slate-800 text-[15px] mb-4">Presentaciones</h3>

                            {/* PPT Document Item */}
                            <div
                                onClick={() => handleDownload('Presentacion_Reunion_Ordinaria.txt')}
                                className="flex items-start gap-4 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                            >
                                <div className="w-12 h-14 bg-gray-100 rounded-lg flex flex-col justify-end overflow-hidden relative border border-gray-200 shadow-sm relative shrink-0">
                                    {/* Document fold corner */}
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
                                    <div className="bg-red-500 text-white text-[10px] font-bold text-center py-1">PPT</div>
                                </div>
                                <div className="pt-1">
                                    <p className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors leading-tight">Presentación Reunión<br />Ordinaria</p>
                                    <p className="text-xs text-slate-500 mt-1">12/02/2023</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 text-[15px] mb-4">Actas y otros documentos</h3>

                            <div className="space-y-4">
                                {/* PDF Document Item */}
                                <div
                                    onClick={() => handleDownload('Acta_de_Comite.txt')}
                                    className="flex items-start gap-4 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                                >
                                    <div className="w-12 h-14 bg-gray-100 rounded-lg flex flex-col justify-end overflow-hidden relative border border-gray-200 shadow-sm shrink-0">
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
                                        <div className="bg-red-500 text-white text-[10px] font-bold text-center py-1">PDF</div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors leading-tight">Acta de Comité</p>
                                        <p className="text-xs text-slate-500 mt-1">12/02/2023</p>
                                    </div>
                                </div>

                                {/* PDF Document Item 2 */}
                                <div
                                    onClick={() => handleDownload('Anexo_Acta_de_Comite.txt')}
                                    className="flex items-start gap-4 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                                >
                                    <div className="w-12 h-14 bg-gray-100 rounded-lg flex flex-col justify-end overflow-hidden relative border border-gray-200 shadow-sm shrink-0">
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
                                        <div className="bg-red-500 text-white text-[10px] font-bold text-center py-1">PDF</div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors leading-tight">Anexo Acta de Comité</p>
                                        <p className="text-xs text-slate-500 mt-1">13/02/2023</p>
                                    </div>
                                </div>

                                {/* DOC Document Item */}
                                <div
                                    onClick={() => handleDownload('Otro_Documento.txt')}
                                    className="flex items-start gap-4 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                                >
                                    <div className="w-12 h-14 bg-gray-100 rounded-lg flex flex-col justify-end overflow-hidden relative border border-gray-200 shadow-sm shrink-0">
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
                                        <div className="bg-cyan-500 text-white text-[10px] font-bold text-center py-1">DOC</div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-bold text-sm text-slate-800 group-hover:text-cyan-600 transition-colors leading-tight">Otro Documento</p>
                                        <p className="text-xs text-slate-500 mt-1">12/02/2023</p>
                                    </div>
                                </div>

                                {/* DOC Document Item 2 */}
                                <div
                                    onClick={() => handleDownload('Otro_Documento_1.txt')}
                                    className="flex items-start gap-4 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                                >
                                    <div className="w-12 h-14 bg-gray-100 rounded-lg flex flex-col justify-end overflow-hidden relative border border-gray-200 shadow-sm shrink-0">
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
                                        <div className="bg-cyan-500 text-white text-[10px] font-bold text-center py-1">DOC</div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-bold text-sm text-slate-800 group-hover:text-cyan-600 transition-colors leading-tight">Otro Documento 1</p>
                                        <p className="text-xs text-slate-500 mt-1">12/02/2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <SignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onSign={(dataUrl) => {
                    setSignatureImage(dataUrl);
                    setIsSignatureModalOpen(false);
                }}
            />
        </div>
    );
}
