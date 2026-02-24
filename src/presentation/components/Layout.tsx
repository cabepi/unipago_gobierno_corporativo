import type { ReactNode } from 'react';
import { LayoutDashboard, LogOut, Home, Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/committees', label: 'Comités', icon: Briefcase },
];

export const Layout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Bar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-2 text-[#05143A] font-bold text-lg">
                    <LayoutDashboard className="w-6 h-6" />
                    Gobierno Corporativo
                </div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 font-medium">Hola, {user.name} ({user.role})</span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Salir
                        </button>
                    </div>
                ) : (
                    <span className="text-sm leading-none text-slate-500 bg-slate-100 px-3 py-1 rounded-full">No autenticado</span>
                )}
            </nav>

            {/* Body: Sidebar + Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-56 bg-white border-r border-slate-100 shadow-sm flex flex-col py-6 gap-1">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? 'bg-slate-100 text-[#05143A]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </aside>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
