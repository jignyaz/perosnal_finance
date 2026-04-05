import { Send, Download, RefreshCw, Smartphone } from 'lucide-react';

const QuickActionGrid = ({ onAction }) => {
    const actions = [
        { id: 'transfer', icon: Send, label: 'Transfer', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
        { id: 'request', icon: Download, label: 'Request', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: 'exchange', icon: RefreshCw, label: 'Exchange', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => onAction && onAction(action.id)}
                    className="glass-panel p-5 border-white/5 flex flex-col items-center justify-center gap-3 group hover:bg-white/5 hover:border-white/10 transition-all duration-500 active:scale-95"
                >
                    <div className={`p-4 rounded-2xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                        <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">
                        {action.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default QuickActionGrid;
