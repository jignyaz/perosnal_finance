import { motion } from 'framer-motion';

const ComparisonSection = () => {
    const comparisonData = [
        { cap: 'Expense Forecasting', trad: 'Only looks at what you already spent', ai: 'Predicts future bills & expenses months ahead' },
        { cap: 'Money Advice', trad: 'Generic tips you already know', ai: 'Personal advice based on your real bills' },
        { cap: 'Data Privacy', trad: 'Often sells user data for targeted ads', ai: '100% private with top bank encryption' },
        { cap: 'Surprise Charges', trad: 'Easy to overlook until it is too late', ai: 'Alerts you to upcoming spikes & renewals' },
        { cap: 'Bank Statements', trad: 'Manual spreadsheet typing', ai: '1-click upload from any bank statement' },
    ];

    return (
        <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10 overflow-hidden">
            {/* Header - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-2xl mx-auto mb-16"
            >
                <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight mb-4">
                    Why This Works Better Than Spreadsheets
                </h2>
                <p className="text-slate-300 text-sm">
                    See why people switch from basic budgeting tools to our smart AI assistant.
                </p>
            </motion.div>

            {/* Table - Slides in from Right */}
            <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="glass-panel rounded-3xl border-white/15 overflow-hidden shadow-2xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-300">
                                <th className="p-6">Feature</th>
                                <th className="p-6 text-slate-400">Old Budgeting Apps</th>
                                <th className="p-6 text-accent bg-accent/10">Our Smart App</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 font-medium">
                            {comparisonData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white font-bold">{row.cap}</td>
                                    <td className="p-6 text-slate-300">{row.trad}</td>
                                    <td className="p-6 text-accent font-bold bg-accent/5">{row.ai}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </section>
    );
};

export default ComparisonSection;
