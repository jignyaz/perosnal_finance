import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, Sparkles, ChevronRight, ChevronLeft, Target, Briefcase, Activity, DollarSign, Wallet } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        dob: '',
        phone_number: '',
        initial_balance: 0,
        monthly_budget: 0,
        fixed_monthly_burn: 0,
        employment_type: 'salaried',
        financial_goal: 'balanced',
        risk_tolerance: 1.0
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: (type === 'number' || type === 'range') ? parseFloat(value) : value
        });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            if (err.message === 'Failed to fetch') {
                setError('Connection Refused: The backend server is not running. Please double-click "start.bat" in the project folder to start the API.');
            } else {
                setError(err.message || 'Registration protocol failure');
            }
        }
    };

    const renderStepIndicators = () => (
        <div className="flex justify-center gap-3 mb-10">
            {[1, 2, 3].map((s) => (
                <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-accent' : s < step ? 'w-8 bg-emerald-500/50' : 'w-8 bg-white/10'
                        }`}
                ></div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-full max-w-xl p-10 glass-panel border-white/5 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles className="w-20 h-20 text-accent animate-pulse" />
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center shadow-2xl shadow-accent/40 border border-white/20 mx-auto mb-6">
                        <span className="text-white font-black text-3xl font-display italic">F</span>
                    </div>
                    <h1 className="text-4xl font-black text-white font-display tracking-tight mb-2">
                        Node Initialization<span className="text-accent">.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                        {step === 1 ? "Identity Hub Verification" : step === 2 ? "Liquidity Parameters" : "Cognitive Directives"}
                    </p>
                </div>

                {renderStepIndicators()}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <div className="relative min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Identity</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-700 focus:border-accent/30 focus:bg-white/10 focus:outline-none transition-all duration-300"
                                    placeholder="Legal Entity Name"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Temporal Origin</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-accent/30 focus:bg-white/10 focus:outline-none transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Link Frequency</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-700 focus:border-accent/30 focus:bg-white/10 focus:outline-none transition-all duration-300"
                                        placeholder="+91 XXXXX XXXXX"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Node Handle</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-accent/30 focus:bg-white/10 transition-all duration-300"
                                        placeholder="Unique identifier"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Protocol</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-700 focus:outline-none focus:border-accent/30 focus:bg-white/10 transition-all duration-300"
                                        placeholder="Secure cipher"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Initial Net Liquidity</label>
                                <div className="relative">
                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="number"
                                        name="initial_balance"
                                        value={formData.initial_balance}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-white focus:outline-none focus:border-accent-blue/30 focus:bg-white/10 transition-all duration-300"
                                        placeholder="Current Balance"
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Planned Monthly Allocation</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="number"
                                        name="monthly_budget"
                                        value={formData.monthly_budget}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-white focus:outline-none focus:border-accent-blue/30 focus:bg-white/10 transition-all duration-300"
                                        placeholder="Budget Limit"
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Fixed Monthly Burn (Baselines)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="number"
                                        name="fixed_monthly_burn"
                                        value={formData.fixed_monthly_burn}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-white focus:outline-none focus:border-accent-blue/30 focus:bg-white/10 transition-all duration-300"
                                        placeholder="Rent, EMI, Utilities"
                                    />
                                </div>
                                <p className="mt-2 text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                                    Improves AI prediction accuracy by identifying non-negotiable outflows.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Employment Persona</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['salaried', 'variable', 'freelance'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, employment_type: type })}
                                            className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.employment_type === type
                                                ? 'bg-accent/20 border-accent text-white'
                                                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Cognitive Directive (Goal)</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: 'savings', label: 'Optimal Liquidity Growth', icon: Activity },
                                        { id: 'balanced', label: 'Neutral Node Stability', icon: Briefcase },
                                        { id: 'lifestyle', label: 'Maximum Lifestyle Burn', icon: Sparkles },
                                    ].map((goal) => (
                                        <button
                                            key={goal.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, financial_goal: goal.id })}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${formData.financial_goal === goal.id
                                                ? 'bg-accent/20 border-accent text-white shadow-lg'
                                                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                                                }`}
                                        >
                                            <goal.icon className={`w-5 h-5 ${formData.financial_goal === goal.id ? 'text-accent' : 'text-slate-600'}`} />
                                            <span className="text-xs font-bold">{goal.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="flex justify-between items-center mb-4 ml-1">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Tolerance Matrix</label>
                                    <span className="text-accent text-[10px] font-black uppercase tracking-widest">{formData.risk_tolerance.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.1"
                                    name="risk_tolerance"
                                    value={formData.risk_tolerance}
                                    onChange={handleChange}
                                    className="w-full accent-accent bg-white/10 rounded-lg h-2"
                                />
                                <div className="flex justify-between text-[8px] text-slate-600 font-black uppercase tracking-widest mt-2">
                                    <span>Conservative</span>
                                    <span>Aggressive</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 flex gap-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="flex-[2] bg-accent/20 hover:bg-accent/30 text-accent font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl border border-accent/20 transition-all flex items-center justify-center gap-2"
                        >
                            Configure Baseline <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-[2] bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl transition-all duration-500 shadow-2xl shadow-accent/20 border border-white/10"
                        >
                            Initialize Cognitive Sync
                        </button>
                    )}
                </div>

                <div className="mt-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Existing Node detected?{' '}
                    <Link to="/login" className="text-accent hover:text-white transition-colors ml-1 border-b border-accent/20">
                        Synchronize Here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
