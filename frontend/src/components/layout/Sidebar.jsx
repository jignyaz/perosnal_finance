import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, ReceiptText, Settings, Zap, LogOut } from 'lucide-react';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const Sidebar = () => {
    const location = useLocation();
    const { formatMoney } = useCurrency();
    const [balance, setBalance] = useState(null);

    // Fetch balance on mount and when location changes (simple way to refresh on nav)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getStats();
                setBalance(data.net_worth);
            } catch (error) {
                console.error("Failed to fetch balance", error);
            }
        };
        fetchStats();
    }, [location.pathname]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Wallet, label: 'Transactions', path: '/transactions' },
        { icon: Zap, label: 'Payments', path: '/payments' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: ReceiptText, label: 'Budgets', path: '/budgets' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-72 h-screen flex flex-col p-4 pr-0 hidden md:flex z-50">
            <div className="flex-1 glass-panel flex flex-col p-6 border-white/5 relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-10 px-2 relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center shadow-lg shadow-accent/20 border border-white/10">
                        <span className="text-white font-black text-2xl font-display italic">F</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white font-display">Finance</span>
                        <span className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase -mt-1 opacity-80">Intelligence</span>
                    </div>
                </div>

                <nav className="space-y-2 flex-1 relative z-10">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative
                                ${isActive
                                    ? 'text-white bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(139,92,246,0.15)] overflow-hidden'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
                                    )}
                                    <item.icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'text-accent scale-110' : 'group-hover:scale-110 group-hover:text-white'}`} />
                                    <span className={`font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative text-slate-400 hover:text-red-400 hover:bg-red-400/5 border border-transparent mt-4"
                    >
                        <LogOut className="w-6 h-6 transition-all duration-500 group-hover:-translate-x-1" />
                        <span className="font-semibold tracking-wide transition-colors duration-300 opacity-70 group-hover:opacity-100">
                            Deauthorize
                        </span>
                    </button>
                </nav>

                <div className="mt-auto relative z-10">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-[10px] uppercase font-black text-accent tracking-[0.15em] mb-2 opacity-80">Total Liquidity</div>
                        <div className="text-2xl font-bold text-white font-display tracking-tight">
                            {balance ? formatMoney(balance) : '— —'}
                        </div>
                        <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-2/3 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
