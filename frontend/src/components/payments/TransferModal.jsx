import { useState } from 'react';
import { X, Send, User, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

const TransferModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState('input'); // input, confirm, processing, success
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleNext = () => {
        if (username && amount) setStep('confirm');
    };

    const handleExecute = async () => {
        setStep('processing');
        setError(null);
        try {
            await api.createTransaction({
                amount: parseFloat(amount),
                category: 'Transfer',
                type: 'expense',
                description: `UPI Transfer to @${username}`,
                date: new Date().toISOString()
            });
            setStep('success');
        } catch (err) {
            console.error("Transfer failed", err);
            setError(err.message || "Protocol execution failed");
            setStep('confirm');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="w-full max-w-md glass-panel p-8 border-white/5 relative z-10 animate-in zoom-in duration-500 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
                            <Send className="w-5 h-5 text-accent-blue" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-accent-blue uppercase tracking-[0.3em]">Direct Node Link</span>
                            <h2 className="text-xl font-display font-black text-white tracking-tight">Transfer Liquidity</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === 'input' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Identity (Username)</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white font-medium outline-none focus:border-accent-blue/50 transition-all placeholder:text-slate-600"
                                    placeholder="e.g. quantum_user_01"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Liquidity Amount (INR)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-display text-2xl font-black outline-none focus:border-accent-blue/50 transition-all placeholder:text-slate-700"
                                placeholder="0.00"
                            />
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!username || !amount}
                            className="w-full py-5 rounded-2xl bg-accent-blue disabled:opacity-30 disabled:hover:bg-accent-blue hover:bg-white text-white hover:text-accent-blue font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 border border-white/10 shadow-2xl shadow-accent-blue/20 flex items-center justify-center gap-3"
                        >
                            Verifying Route
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {step === 'confirm' && (
                    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Target Node</span>
                                <span className="text-white">@{username}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-4">
                                <span>Total Value</span>
                                <span className="text-2xl font-display font-black text-white">₹{parseFloat(amount).toLocaleString()}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-3 px-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                End-to-end encryption active.<br />
                                <span className="text-emerald-400 opacity-80">Network verification complete.</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setStep('input')} className="py-4 rounded-xl bg-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                                Adjust
                            </button>
                            <button onClick={handleExecute} className="py-4 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                                Execute
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="py-12 flex flex-col items-center justify-center animate-pulse">
                        <Loader2 className="w-12 h-12 text-accent-blue animate-spin mb-6" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Migrating Liquidity...</span>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-display font-black text-white mb-2">Finalized</h3>
                        <p className="text-slate-400 text-sm mb-8 text-center px-4">Transfer to @{username} has been verified and recorded.</p>

                        <div className="w-full bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-4 flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Quantum Rewards Earned</span>
                            <span className="text-emerald-400 font-bold text-lg">+10 PTS</span>
                        </div>

                        <button onClick={onClose} className="w-full py-5 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:scale-105 active:scale-95">
                            Return to Matrix
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferModal;
