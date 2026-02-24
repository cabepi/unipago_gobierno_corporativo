
export interface TabItem {
    id: string;
    label: string;
    count?: number;
}

interface TabsProps {
    tabs: TabItem[];
    activeTabId: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTabId, onTabChange, className = '' }: TabsProps) {
    return (
        <nav className={`flex space-x-8 text-sm font-medium border-b border-gray-100 w-full md:w-auto overflow-x-auto ${className}`}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`pb-3 whitespace-nowrap border-b-2 transition-colors font-bold ${isActive
                            ? 'text-slate-800 border-red-600'
                            : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-200'
                            }`}
                    >
                        {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
                    </button>
                );
            })}
        </nav>
    );
}
