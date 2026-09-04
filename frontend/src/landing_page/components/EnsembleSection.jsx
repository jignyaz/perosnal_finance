import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, BrainCircuit, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const EnsembleSection = () => {
    const [activeTier, setActiveTier] = useState(0);

    const spendingLayers = [
        {
            title: "Layer 1: Fixed Regular Bills",
            subtitle: "Rent, Loans, Utilities & Subscriptions",
            description: "The AI immediately recognizes your non-negotiable monthly expenses and guarantees they are budgeted for in advance.",
            badge: "Essential Baseline",
            icon: Calendar,
            color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400"
        },
        {
            title: "Layer 2: Daily & Weekend Habits",
            subtitle: "Groceries, Dining, Shopping & Travel",
            description: "Deep learning tracks subtle shifts in your everyday lifestyle habits and adjusts your future budget so you never overspend.",
            badge: "Habit Tracking",
            icon: TrendingUp,
            color: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/40 text-purple-400"
        },
        {
            title: "Layer 3: Surprise Spikes & Alerts",
            subtitle: "One-Off Purchases & Price Increases",
            description: "Automatically spots unusual price hikes, annual renewal fees, or irregular spikes and warns you before they hurt your savings.",
            badge: "Spike Shield",
            icon: AlertTriangle,
            color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Header - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>How The AI Forecasts Your Spending</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight mb-4">
                    Never Get Caught Off Guard By <br />
                    <span className="text-accent">Surprise Bills Again</span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                    Most budgeting apps only show where your money went in the past. Our AI looks ahead at your recurring bills, changing habits, and upcoming seasons so you always know what's coming.
                </p>
            </motion.div>

            {/* 3 Interactive Layer Cards - Slide in from Left, Center, and Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {spendingLayers.map((layer, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx === 0 ? -80 : idx === 1 ? 0 : 80, y: idx === 1 ? 40 : 0 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }}
                        whileHover={{ scale: 1.03, y: -6 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTier(idx)}
                        className={`p-7 rounded-3xl cursor-pointer transition-all duration-300 glass-panel border ${activeTier === idx
                            ? `bg-white/10 ${layer.color} shadow-2xl shadow-cyan-500/15 border-accent/40`
                            : 'border-white/10 hover:border-white/25 bg-white/5 opacity-80 hover:opacity-100'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${layer.color}`}>
                                {layer.badge}
                            </span>
                            <span className="text-xs font-mono text-slate-400">Step 0{idx + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mb-1">{layer.title}</h3>
                        <div className="text-xs font-bold text-accent mb-3">{layer.subtitle}</div>
                        <p className="text-slate-300 text-sm leading-relaxed">{layer.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* How It Works 4-Step Journey - Slides in from Right */}
            <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="glass-panel p-8 rounded-3xl border-white/15 bg-slate-950/70 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <BrainCircuit className="w-64 h-64 text-accent animate-pulse-glow" />
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                    4 Simple Steps to Complete Financial Clarity
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                    {[
                        { step: 'STEP 01', title: 'Connect or Upload', desc: 'Add your transactions manually or upload bank statements in seconds.', color: 'text-cyan-400' },
                        { step: 'STEP 02', title: 'Find Fixed Habits', desc: 'The AI maps out your recurring bills, subscriptions, and regular food costs.', color: 'text-cyan-400' },
                        { step: 'STEP 03', title: 'Catch Hidden Spikes', desc: 'Identifies forgotten renewals and alerts you before they hit your account.', color: 'text-purple-400' },
                        { step: 'STEP 04', title: 'Clear 6-Month Plan', desc: 'Gives you an accurate forecast so you can save more with zero stress.', color: 'text-emerald-400' },
                    ].map((box, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.04, y: -4 }}
                            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 transition-all duration-300"
                        >
                            <div className={`text-xs font-bold ${box.color} mb-1 font-mono`}>{box.step}</div>
                            <div className="font-bold text-white text-base mb-2 font-display">{box.title}</div>
                            <p className="text-xs text-slate-300 leading-relaxed">{box.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default EnsembleSection;
