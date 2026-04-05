import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color, to }) => {
    const isPositive = trend === 'up';

    const CardContent = () => (
        <>
            {/* Background Holographic Glow */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-all duration-700 ${color ? 'bg-accent' : 'bg-slate-500'}`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-accent/30 transition-all duration-500 shadow-inner group-hover:scale-110">
                    <Icon className={`w-6 h-6 ${color ? 'text-accent' : 'text-slate-400'}`} />
                </div>
                {trendValue && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl border ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-2 opacity-80">{title}</h3>
                <p className="text-3xl font-bold text-white font-display tracking-tight group-hover:text-accent transition-colors duration-500">{value}</p>
                <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
        </>
    );

    if (to) {
        return (
            <Link to={to} className="glass-panel p-6 border-white/5 relative overflow-hidden group block">
                <CardContent />
            </Link>
        );
    }

    return (
        <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
            <CardContent />
        </div>
    );
};

export default StatCard;
