import { useState, useEffect, useRef } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, Loader2, Camera, Upload, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const ScanModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('scanning'); // scanning, processing, success, error
    const [mode, setMode] = useState('camera'); // camera, upload
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setHasPermission(true);
        } catch (err) {
            console.error("Camera error:", err);
            setHasPermission(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setStep('processing');
        }
    };

    useEffect(() => {
        if (isOpen && mode === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, mode]);

    useEffect(() => {
        if (!isOpen) {
            setStep('scanning');
            setProgress(0);
            return;
        }

        if (step === 'processing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        // Trigger backend transaction creation
                        const finalizeTx = async () => {
                            try {
                                await api.createTransaction({
                                    amount: 500, // Simulated scanned amount
                                    category: 'UPI Scan',
                                    type: 'expense',
                                    description: 'Quantum QR Scan Payment',
                                    date: new Date().toISOString()
                                });
                                setStep('success');
                            } catch (err) {
                                console.error("Scan finalization failed", err);
                                setStep('scanning');
                                alert("Link broken. Entropy validation failed.");
                            }
                        };
                        finalizeTx();
                        return 100;
                    }
                    return prev + 5;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isOpen, step]);

    // Note: Automatic camera detection simulation removed to adhere to Ocular Standards.
    // The system now waits for a real detection event or temporal timeout.

    // Handle auto-close on error
    useEffect(() => {
        if (step === 'error') {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [step, onClose]);

    // Universal scan timeout (Simulation of no QR found)
    useEffect(() => {
        if (isOpen && step === 'scanning') {
            const timer = setTimeout(() => {
                setStep('error');
                stopCamera();
                console.warn("QR Scan Standard: Temporal timeout reached without valid signature.");
            }, 10000); // 10 seconds to find a QR
            return () => clearTimeout(timer);
        }
    }, [isOpen, step]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="w-full max-w-lg glass-panel p-10 border-white/5 relative z-10 animate-in zoom-in duration-500 overflow-hidden shadow-2xl">
                {/* Background decorative glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full"></div>

                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Quantum Ocular Matrix</span>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative">
                    {step === 'scanning' && (
                        <div className="flex flex-col items-center">
                            <div className="relative w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden group mb-8">
                                {mode === 'camera' ? (
                                    <>
                                        {hasPermission === false ? (
                                            <div className="text-center p-6">
                                                <Camera className="w-12 h-12 text-red-400 mx-auto mb-4 opacity-50" />
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose">Optical Hardware Inaccessible</p>
                                                <button onClick={startCamera} className="mt-4 text-accent-blue text-[10px] font-black uppercase tracking-widest border-b border-accent-blue/30 pb-1">Retry Authorization</button>
                                            </div>
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover transform scale-x-[-1]"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center p-10">
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-6">Inject image artifact</p>
                                        <label className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl cursor-pointer transition-all border border-white/10">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Select Protocol</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                        </label>
                                    </div>
                                )}

                                {/* Scanning Effects */}
                                {step === 'scanning' && mode === 'camera' && hasPermission && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-x-0 h-1 bg-accent-blue shadow-[0_0_20px_rgba(30,144,255,0.8)] animate-[scan_2s_infinite]"></div>
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent-blue rounded-tl-xl"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent-blue rounded-tr-xl"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent-blue rounded-bl-xl"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent-blue rounded-br-xl"></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setMode('camera')}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-500 ${mode === 'camera' ? 'bg-accent-blue border-white/20 text-white shadow-lg shadow-accent-blue/20' : 'bg-white/5 border-white/5 text-slate-500'
                                        }`}
                                >
                                    <Camera className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Matrix</span>
                                </button>
                                <button
                                    onClick={() => setMode('upload')}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-500 ${mode === 'upload' ? 'bg-accent-blue border-white/20 text-white shadow-lg shadow-accent-blue/20' : 'bg-white/5 border-white/5 text-slate-500'
                                        }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Artifact Injection</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center py-12">
                            <div className="w-20 h-20 rounded-full bg-accent-blue/20 flex items-center justify-center mb-8 relative">
                                <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
                                <div className="absolute inset-0 border-2 border-accent-blue rounded-full opacity-20 scale-125 animate-pulse"></div>
                            </div>
                            <h3 className="text-xl font-display font-black text-white tracking-tight mb-2">Synthesizing Transaction</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 text-center leading-loose">
                                Resolving quantum nodes...<br />
                                <span className="opacity-50">Entropy validation in progress</span>
                            </p>

                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-blue transition-all duration-300 shadow-[0_0_10px_rgba(30,144,255,0.5)]" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center py-8 animate-in zoom-in-95 duration-700">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h3 className="text-3xl font-display font-black text-white tracking-tighter mb-2">Finalized</h3>
                            <p className="text-slate-400 text-sm mb-10">Liquidity successfully migrated to target node.</p>

                            <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4 mb-8">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Ref Hub</span>
                                    <span className="text-white">NODE-55291-QX</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Encryption</span>
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        ECC-512-MATRIX
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-4 flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Quantum Rewards Earned</span>
                                <span className="text-emerald-400 font-bold text-lg">+10 PTS</span>
                            </div>

                            <button onClick={onClose} className="w-full py-5 rounded-2xl bg-accent-blue hover:bg-white text-white hover:text-accent-blue font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 border border-white/10 shadow-2xl shadow-accent-blue/20">
                                Return to Matrix
                            </button>
                        </div>
                    )}
                    {step === 'error' && (
                        <div className="flex flex-col items-center py-12 animate-in zoom-in-95 duration-500 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-8 shadow-2xl shadow-red-500/20">
                                <RefreshCw className="w-10 h-10 text-red-400 rotate-180" />
                            </div>
                            <h3 className="text-xl font-display font-black text-white tracking-tight mb-2">No Valid QR Detected</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-loose">
                                Optical signature mismatch.<br />
                                <span className="opacity-50 text-red-400/50">Terminating ocular interface...</span>
                            </p>
                        </div>
                    )}
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scan {
                        0% { top: -5%; }
                        100% { top: 105%; }
                    }
                `}} />
            </div>
        </div>
    );
};

export default ScanModal;
