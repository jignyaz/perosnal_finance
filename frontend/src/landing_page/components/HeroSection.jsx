import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, Sliders, ShieldCheck, Lock, CheckCircle, TrendingUp, Radar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
    const { user } = useAuth();

    return (
        <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Top Text Content - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -70 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-4xl mx-auto mb-16"
            >
                {/* Badge */}
                <div className="inline-block mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border-accent/30 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider shadow-xl shadow-accent/10 cursor-default"
                    >
                        <Sparkles className="w-4 h-4 text-accent animate-spin-slow" />
                        <span>Smart Personal Finance • Future Expense Predictions</span>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                    </motion.div>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.1] mb-8 text-white">
                    Take Control of Your Money With <br />
                    <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent animate-gradient-flow">
                        Smart AI Forecasting
                    </span>
                </h1>

                {/* Hero Subtitle */}
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
                    See what you'll spend up to 6 months ahead, chat with your personal AI money assistant, and grow your savings with zero guesswork.
                </p>

                {/* Call-to-action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="w-full sm:w-auto"
                    >
                        <Link
                            to={user ? "/dashboard" : "/register"}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl shadow-2xl shadow-accent/30 hover:shadow-accent/60 transition-all border border-white/20"
                        >
                            <Zap className="w-5 h-5 fill-current animate-bounce-slow" />
                            <span>{user ? "Go to Dashboard" : "Create Free Account"}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="w-full sm:w-auto"
                    >
                        <a
                            href="#calculator"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 glass-panel hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider px-7 py-4 rounded-2xl border border-white/15 transition-all shadow-lg"
                        >
                            <Sliders className="w-4 h-4 text-accent" />
                            <span>Try Savings Calculator</span>
                        </a>
                    </motion.div>
                </div>

                {!user && (
                    <div className="mt-4 text-center">
                        <Link
                            to="/login"
                            className="text-xs font-bold text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-1.5"
                        >
                            <span>Already registered?</span>
                            <span className="text-white underline underline-offset-4 decoration-accent">Sign In Here</span>
                            <ArrowRight className="w-3 h-3 text-accent" />
                        </Link>
                    </div>
                )}

                {/* Reassurance points */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Private & Encrypted</span>
                    <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-accent" /> Your Data Is Never Sold</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-purple-400" /> Fast & Simple Setup</span>
                </div>
            </motion.div>

            {/* Mockup Card - Slides in from Right */}
            <motion.div
                initial={{ opacity: 0, x: 70 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="relative max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 glass-panel border-white/15 shadow-2xl shadow-accent/20 bg-gradient-to-b from-white/10 to-transparent animate-float"
            >
                {/* Header of Mockup */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/70 rounded-2xl mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        <span className="text-xs font-medium text-slate-400 ml-3">Personal Finance AI Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/30 shadow-[0_0_12px_rgba(0,255,204,0.3)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
                        Live Expense Forecast
                    </div>
                </div>

                {/* Content inside Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mock Card 1: Balance & Stats */}
                    <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="glass-panel p-5 rounded-2xl border-white/10 bg-white/5 flex flex-col justify-between"
                    >
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Balance</div>
                            <div className="text-3xl font-black font-display text-white tracking-tight">₹7,48,200</div>
                            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3.5 h-3.5 animate-bounce-slow" /> +14.2% saved this month
                            </div>
                        </div>

                        <div className="space-y-3 mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Monthly Spending</span>
                                <span className="font-bold text-white">₹32,500</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Saved with AI Advice</span>
                                <span className="font-bold text-accent">+₹4,800</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Reward Points</span>
                                <span className="font-bold text-amber-300">1,240 pts ⚡</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mock Card 2: Visual Chart */}
                    <motion.div
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="glass-panel p-5 rounded-2xl border-white/10 bg-white/5 md:col-span-2 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                                    <Radar className="w-3.5 h-3.5 animate-spin-slow" />
                                    Smart Prediction
                                </div>
                                <div className="text-lg font-bold font-display text-white">6-Month Spending Forecast</div>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Past Patterns</span>
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">AI Prediction</span>
                            </div>
                        </div>

                        {/* Animated SVG Wave Chart */}
                        <div className="h-32 w-full relative flex items-end py-2 overflow-hidden">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gradientForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.0" />
                                    </linearGradient>
                                    <linearGradient id="gradientResidual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                <path
                                    d="M 0 65 Q 60 50, 120 70 T 240 45 T 360 35 L 400 30 L 400 85 L 0 95 Z"
                                    fill="url(#gradientResidual)"
                                />
                                <path
                                    d="M 0 75 Q 70 60, 140 75 T 280 50 T 400 38 L 400 100 L 0 100 Z"
                                    fill="url(#gradientForecast)"
                                />
                                <path
                                    d="M 0 75 Q 70 60, 140 75 T 280 50 T 400 38"
                                    fill="none"
                                    stroke="#00ffcc"
                                    strokeWidth="3.5"
                                    className="animate-wave-dash"
                                />
                                <circle cx="0" cy="75" r="4" fill="#00ffcc" />
                                <circle cx="140" cy="75" r="4" fill="#00ffcc" />
                                <circle cx="280" cy="50" r="4" fill="#00ffcc" />
                                <circle cx="400" cy="38" r="6" fill="#10b981" stroke="#fff" strokeWidth="2.5" className="animate-ping" />
                                <circle cx="400" cy="38" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                            </svg>
                        </div>

                        {/* Status tags */}
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-white/10 text-xs">
                            <div className="bg-slate-900/80 p-2.5 rounded-xl text-slate-300 border border-white/5">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Regular Bills:</span>
                                <span className="text-cyan-400 font-bold">₹28,400/mo</span>
                            </div>
                            <div className="bg-slate-900/80 p-2.5 rounded-xl text-slate-300 border border-white/5">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Upcoming Extras:</span>
                                <span className="text-emerald-400 font-bold">+₹1,425</span>
                            </div>
                            <div className="bg-slate-900/80 p-2.5 rounded-xl text-slate-300 border border-white/5">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Unused Charges:</span>
                                <span className="text-emerald-400 font-bold">None Detected</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
