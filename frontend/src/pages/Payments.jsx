import { useState, useEffect } from 'react';
import { Zap, QrCode, Send, ArrowDownLeft, Wallet, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import QuickActionGrid from '../components/payments/QuickActionGrid';
import ScanModal from '../components/payments/ScanModal';
import TransferModal from '../components/payments/TransferModal';
import CurrencyExchangeModal from '../components/payments/CurrencyExchangeModal';

const Payments = () => {
    const { formatMoney } = useCurrency();
    const [isScanOpen, setIsScanOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isExchangeOpen, setIsExchangeOpen] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats for payment hub:", err);
            }
        };
        fetchStats();
    }, []);

    const handleAction = (type) => {
        if (type === 'transfer') setIsTransferOpen(true);
        if (type === 'exchange') setIsExchangeOpen(true);
        if (type === 'request') {
            // Placeholder/Coming soon for request
            alert("Request protocol pending deployment.");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-accent-blue rounded-full"></div>
                        <span className="text-[10px] font-black text-accent-blue uppercase tracking-[0.3em]">Neural Payments Hub</span>
                    </div>
                    <h1 className="text-5xl font-display font-black text-white tracking-tighter">
                        Quantum Pay<span className="text-accent-blue">.</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-md leading-relaxed">
                        Authorized access to <span className="text-white">Global Liquidity Nodes</span>. Secure, instant, and encrypted.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Portal */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-10 relative overflow-hidden group border-white/5 bg-gradient-to-br from-accent-blue/10 to-transparent">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                            <Zap className="w-48 h-48 text-accent-blue" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center mb-6 shadow-2xl shadow-accent-blue/20 group-hover:scale-110 transition-transform duration-500 relative">
                                <QrCode className="w-10 h-10 text-accent-blue" />
                                <div className="absolute inset-0 border-2 border-accent-blue rounded-3xl animate-ping opacity-20 scale-125"></div>
                            </div>
                            <h2 className="text-3xl font-display font-black text-white tracking-tight mb-3">Initialize Neural Scan</h2>
                            <p className="text-slate-400 text-sm max-w-xs mb-8">Align any QR protocol within the ocular matrix to trigger instant liquidity transfer.</p>

                            <button
                                onClick={() => setIsScanOpen(true)}
                                className="bg-accent-blue hover:bg-white text-white hover:text-accent-blue font-black uppercase tracking-[0.2em] text-xs px-10 py-4 rounded-2xl transition-all duration-500 shadow-2xl shadow-accent-blue/30 active:scale-95 border border-white/10"
                            >
                                Open Scanner
                            </button>
                        </div>
                    </div>

                </div>

                {/* Wallet & Quick Actions */}
                <div className="space-y-8">
                    <div className="glass-panel p-8 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/10 blur-2xl rounded-full"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                                <Wallet className="w-5 h-5 text-accent-blue" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Vault</span>
                        </div>
                        <div className="text-4xl font-display font-black text-white tracking-tighter mb-2">
                            {formatMoney(stats?.net_worth || 0)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
                            Network Synchronized
                        </div>
                    </div>

                    <QuickActionGrid onAction={handleAction} />

                    <div className="glass-panel p-8 border-white/5 relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantum Rewards</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                Protocol Active
                            </div>
                        </div>
                        <div className="flex items-end gap-3 mb-1">
                            <div className="text-4xl font-display font-black text-white tracking-tighter">
                                {stats?.reward_points || 0}
                            </div>
                            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1.5">Points</div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <span>Equivalent to</span>
                            <span className="text-white">₹{((stats?.reward_points || 0) * 0.1).toFixed(2)}</span>
                            <span className="opacity-50">(10 PTS = ₹1)</span>
                        </div>
                    </div>
                </div>
            </div>

            <ScanModal isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
            <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
            <CurrencyExchangeModal isOpen={isExchangeOpen} onClose={() => setIsExchangeOpen(false)} />
        </div>
    );
};

export default Payments;
