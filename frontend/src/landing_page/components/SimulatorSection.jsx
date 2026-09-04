import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

const formatRupees = (amount) => {
    return '₹' + Number(Math.round(amount)).toLocaleString('en-IN');
};

const SimulatorSection = () => {
    const [monthlyIncome, setMonthlyIncome] = useState(50000);
    const [monthlySpend, setMonthlySpend] = useState(32000);
    const [simulationPeriod, setSimulationPeriod] = useState(6);

    const simResults = useMemo(() => {
        const currentMonthlySavings = Math.max(0, monthlyIncome - monthlySpend);
        const aiOptimizedSpend = monthlySpend * 0.88; // 12% saving by cutting forgotten waste
        const aiMonthlySavings = Math.max(0, monthlyIncome - aiOptimizedSpend);
        const extraSavedMonthly = aiMonthlySavings - currentMonthlySavings;

        // Trajectory points
        const trajectory = [];
        let curBase = 0;
        let curAi = 0;
        for (let m = 1; m <= simulationPeriod; m++) {
            curBase += currentMonthlySavings * (1 + (0.06 / 12) * m);
            curAi += aiMonthlySavings * (1 + (0.08 / 12) * m);
            trajectory.push({
                month: `Month ${m}`,
                standard: Math.round(curBase),
                aiEnhanced: Math.round(curAi),
            });
        }

        return {
            currentMonthlySavings,
            aiMonthlySavings,
            extraSavedMonthly,
            totalAiBoost: Math.round(aiMonthlySavings * simulationPeriod - currentMonthlySavings * simulationPeriod),
            trajectory,
        };
    }, [monthlyIncome, monthlySpend, simulationPeriod]);

    return (
        <section id="calculator" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 overflow-hidden">
            {/* Header - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Sliders className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Interactive Savings Calculator</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight mb-4">
                    See How Much More <br />
                    <span className="text-emerald-400">You Could Save in Rupees</span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                    Move the sliders to enter your monthly income and spending. See how smart budget adjustments and cutting unused subscriptions can grow your savings.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Sliders Console - Slides in from Left */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="lg:col-span-5 glass-panel p-8 rounded-3xl border-white/15 bg-slate-950/70 flex flex-col justify-between space-y-6 shadow-2xl"
                >
                    {/* Slider 1: Monthly Income */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Monthly Income</label>
                            <motion.span
                                key={monthlyIncome}
                                initial={{ scale: 1.2, color: '#00ffcc' }}
                                animate={{ scale: 1, color: '#ffffff' }}
                                className="text-lg font-black font-display"
                            >
                                {formatRupees(monthlyIncome)}
                            </motion.span>
                        </div>
                        <input
                            type="range"
                            min="15000"
                            max="300000"
                            step="2500"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                            className="w-full accent-accent bg-white/10 rounded-lg h-2 cursor-pointer transition-all"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-bold mt-1">
                            <span>{formatRupees(15000)}</span>
                            <span>{formatRupees(300000)}</span>
                        </div>
                    </div>

                    {/* Slider 2: Monthly Spend */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Monthly Spending</label>
                            <motion.span
                                key={monthlySpend}
                                initial={{ scale: 1.2, color: '#10b981' }}
                                animate={{ scale: 1, color: '#00ffcc' }}
                                className="text-lg font-black font-display text-accent"
                            >
                                {formatRupees(monthlySpend)}
                            </motion.span>
                        </div>
                        <input
                            type="range"
                            min="5000"
                            max={monthlyIncome}
                            step="1000"
                            value={monthlySpend}
                            onChange={(e) => setMonthlySpend(Number(e.target.value))}
                            className="w-full accent-emerald-400 bg-white/10 rounded-lg h-2 cursor-pointer transition-all"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-bold mt-1">
                            <span>{formatRupees(5000)}</span>
                            <span>{formatRupees(monthlyIncome)}</span>
                        </div>
                    </div>

                    {/* Simulation Duration Selector */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">Time Period</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[3, 6, 12].map((m) => (
                                <motion.button
                                    key={m}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSimulationPeriod(m)}
                                    className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${simulationPeriod === m
                                        ? 'bg-accent text-slate-950 font-black border-accent shadow-lg shadow-accent/25'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {m} Months
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Summary Pill inside Slider Box */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs uppercase font-bold text-slate-400 mb-1">Estimated Monthly Extra Savings</div>
                        <div className="text-sm font-bold text-white">
                            Save an extra <span className="text-accent font-black">+{formatRupees(simResults.extraSavedMonthly)}/mo</span> by finding forgotten subscriptions & trimming budget leaks.
                        </div>
                    </div>
                </motion.div>

                {/* Simulation Visual Result Card - Slides in from Right */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="lg:col-span-7 glass-panel p-8 rounded-3xl border-white/15 bg-slate-950/70 flex flex-col justify-between shadow-2xl"
                >
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Total Extra Saved Over {simulationPeriod} Months</span>
                                <motion.span
                                    key={simResults.totalAiBoost}
                                    initial={{ scale: 1.15 }}
                                    animate={{ scale: 1 }}
                                    className="text-3xl sm:text-4xl font-black font-display text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                                >
                                    +{formatRupees(simResults.totalAiBoost)}
                                </motion.span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Total Projected Balance</span>
                                <span className="text-2xl font-bold font-display text-white">
                                    {formatRupees(simResults.trajectory[simResults.trajectory.length - 1]?.aiEnhanced || 0)}
                                </span>
                            </div>
                        </div>

                        {/* Animated Trajectory Bars */}
                        <div className="space-y-4 my-6">
                            {simResults.trajectory.slice(0, 4).map((pt, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-300">{pt.month}</span>
                                        <div className="flex gap-4">
                                            <span className="text-slate-400">Normal: {formatRupees(pt.standard)}</span>
                                            <span className="text-accent font-bold">With AI Tips: {formatRupees(pt.aiEnhanced)}</span>
                                        </div>
                                    </div>
                                    <div className="h-3.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 p-0.5 border border-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (pt.standard / (simResults.trajectory[simResults.trajectory.length - 1]?.aiEnhanced || 1)) * 100)}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="h-full bg-slate-600 rounded-full"
                                        />
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(5, ((pt.aiEnhanced - pt.standard) / (simResults.trajectory[simResults.trajectory.length - 1]?.aiEnhanced || 1)) * 100)}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full shadow-[0_0_10px_rgba(0,255,204,0.5)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA for Simulator */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-300">
                            Want to start saving this amount on your real bank account?
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto text-center bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-400/25 block"
                            >
                                Start Saving Now ➔
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SimulatorSection;
