import { useEffect, useState } from 'react';
import { Sparkles, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const PredictionCard = () => {
    const { formatMoney } = useCurrency();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPrediction, setShowPrediction] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInteraction = () => {
        if (loading) return;
        if (error) {
            setError(null);
            setLoading(true);
            fetchPrediction();
            return;
        }

        if (showPrediction) {
            setShowPrediction(false);
        } else {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setShowPrediction(true);
            }, 1500);
        }
    };

    const fetchPrediction = async () => {
        try {
            const data = await api.getPrediction();
            setPrediction(data);
            setError(null);
        } catch (err) {
            setError(err.message === "Not enough data" ? "Data Insufficient" : "Neural Link Failure");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrediction();
    }, []);

    return (
        <div
            onClick={handleInteraction}
            className={`glass-panel p-6 bg-gradient-to-br from-accent/10 to-accent-blue/5 border-white/10 relative overflow-hidden transition-all duration-500 group ${!loading ? 'cursor-pointer' : ''}`}
        >
            {/* Background scanner effect */}
            {isProcessing && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent/40 shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-[scan_2s_infinite]"></div>
                </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Sparkles className="w-32 h-32 text-accent" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-accent/20 border border-accent/20 transition-all ${isProcessing ? 'animate-pulse scale-110 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : ''}`}>
                        <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-white tracking-tight font-display">AI Forecast Engine</h3>
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest opacity-70">Neural Predictions</span>
                    </div>
                </div>
                {!loading && !error && (
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                        {showPrediction ? "Dismiss" : "Analyze"}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                {loading ? (
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        Initializing Neural Link...
                    </div>
                ) : error ? (
                    <div className="flex flex-col gap-3 py-2">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                        <button className="text-[10px] uppercase font-black text-accent hover:text-white transition-colors w-fit tracking-widest py-1 border-b border-accent/20">
                            Re-establish Connection
                        </button>
                    </div>
                ) : (
                    <div className="min-h-[80px] flex flex-col justify-center">
                        {!showPrediction && !isProcessing && (
                            <div className="absolute inset-x-0 bottom-0 top-6 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
                                <div className="bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.4)] border border-white/20 animate-bounce-slow">
                                    Trigger AI Reveal
                                </div>
                            </div>
                        )}

                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mb-3">
                            Estimated Liquidity Flow
                        </div>

                        <div className="relative overflow-hidden py-1">
                            {isProcessing ? (
                                <div className="flex items-center gap-3 text-white font-bold text-lg animate-pulse">
                                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                    <span className="tracking-tighter font-display italic">Synthesizing patterns...</span>
                                </div>
                            ) : (
                                <div className={`text-5xl font-display font-black text-white tracking-tighter transition-all duration-1000 ${showPrediction ? 'blur-0 opacity-100' : 'blur-xl opacity-20'}`}>
                                    {showPrediction ? formatMoney(prediction?.predictions?.[0]?.predicted_amount || 0) : '$88,888.88'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}} />
        </div>
    );
};

export default PredictionCard;
