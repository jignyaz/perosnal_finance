import { useState, useMemo } from 'react';
import { X, RefreshCw, Calculator, TrendingUp, Globe2, ArrowRightLeft } from 'lucide-react';

const CurrencyExchangeModal = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState('1000');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    // Simulated market rates (referenced to 1 INR)
    const rates = useMemo(() => ({
        // Global
        'USD': 0.012,
        'EUR': 0.011,
        'GBP': 0.0094,
        // Asian
        'JPY': 1.82,
        'CNY': 0.086,
        'SGD': 0.016,
        'KRW': 15.68,
        'AED': 0.044,
        // African
        'ZAR': 0.23,
        'EGP': 0.58,
        'NGN': 18.24,
        'KES': 1.56,
        'GHS': 0.18
    }), []);

    const currencies = [
        { code: 'USD', label: 'US Dollar', group: 'Global' },
        { code: 'EUR', label: 'Euro', group: 'Global' },
        { code: 'JPY', label: 'Yen', group: 'Asian' },
        { code: 'CNY', label: 'Yuan', group: 'Asian' },
        { code: 'SGD', label: 'SG Dollar', group: 'Asian' },
        { code: 'ZAR', label: 'Rand', group: 'African' },
        { code: 'EGP', label: 'EP Pound', group: 'African' },
        { code: 'NGN', label: 'Naira', group: 'African' }
    ];

    const convertedAmount = useMemo(() => {
        const val = parseFloat(amount) || 0;
        return (val * rates[selectedCurrency]).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }, [amount, selectedCurrency, rates]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="w-full max-w-2xl glass-panel p-1 border-white/5 relative z-10 animate-in zoom-in duration-500 overflow-hidden shadow-2xl">
                <div className="p-8 lg:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Quantum Converter</span>
                                <h2 className="text-2xl font-display font-black text-white tracking-tight">Global Liquidity Nodes</h2>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Calculator Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Source Node (INR)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-display text-2xl font-black outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                        <span className="text-[10px] font-black text-white">INR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center -my-3 relative z-10">
                                <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 shadow-xl">
                                    <ArrowRightLeft className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Node ({selectedCurrency})</label>
                                <div className="relative group">
                                    <div className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl px-6 py-4 text-purple-400 font-display text-2xl font-black">
                                        {convertedAmount}
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <span className="text-[10px] font-black text-purple-400">{selectedCurrency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    Real-time variance: <span className="text-emerald-400">+0.12% favorable</span>
                                </div>
                            </div>
                        </div>

                        {/* Node Selection Section */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Globe2 className="w-3 h-3" /> Select Target Vector
                            </h3>
                            <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                {currencies.map((curr) => (
                                    <button
                                        key={curr.code}
                                        onClick={() => setSelectedCurrency(curr.code)}
                                        className={`flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 ${selectedCurrency === curr.code
                                                ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between w-full items-center mb-1">
                                            <span className="text-sm font-black text-white tracking-widest">{curr.code}</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase">{curr.group}</span>
                                        </div>
                                        <span className="text-[9px] font-medium text-slate-500">{curr.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button className="w-full py-4 rounded-2xl bg-purple-500 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-purple-500 transition-all duration-500 shadow-2xl shadow-purple-500/20 mt-2">
                                Swap Protocol
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative pattern */}
                <div className="h-2 w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
            `}} />
        </div>
    );
};

export default CurrencyExchangeModal;
