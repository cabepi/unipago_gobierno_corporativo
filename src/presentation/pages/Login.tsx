import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [step, setStep] = useState<'email' | 'token'>('email');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to validate email');
            }

            if (data.step === 'token_needed') {
                setStep('token');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTokenSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to verify token');
            }

            if (data.token && data.user && authContext) {
                const userWithPermissions = { ...data.user, permissions: data.permissions || [] };
                authContext.login(data.token, userWithPermissions);
                navigate('/home');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">

                {/* Header styling for a premium look */}
                <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #05143A 0%, #0a2a6e 100%)' }}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Gobierno Corporativo</h1>
                    <p className="text-slate-300 mt-2 text-sm">Acceso al sistema</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">
                            {error}
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#05143A] focus:border-[#05143A] outline-none transition-all"
                                    placeholder="usuario@empresa.com"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow-md disabled:opacity-70" style={{ backgroundColor: '#05143A' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a2a6e'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#05143A'}
                            >
                                {loading ? 'Verificando...' : 'Siguiente'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleTokenSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="text-center mb-4">
                                <p className="text-sm text-slate-500">Hemos enviado un código a:</p>
                                <p className="font-medium text-slate-800">{email}</p>
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="text-[#05143A] text-xs mt-1 hover:underline"
                                >
                                    Cambiar correo
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Código de Verificación (Token)</label>
                                <input
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="w-full px-4 py-3 text-center text-lg tracking-widest rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#05143A] focus:border-[#05143A] outline-none transition-all"
                                    placeholder="123456"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-2 text-center">
                                    (Modo desarrollo: Ingresa cualquier número)
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow-md disabled:opacity-70" style={{ backgroundColor: '#05143A' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a2a6e'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#05143A'}
                            >
                                {loading ? 'Iniciando sesión...' : 'Ingresar'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
