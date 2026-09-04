import { motion } from 'framer-motion';

const MetricsTicker = () => {
    const metrics = [
        { value: '95%', label: 'Prediction Accuracy', sub: 'Learns your spending habits', color: 'text-accent', slideFrom: -60 },
        { value: '4 Layers', label: 'AI Prediction Models', sub: 'Forecasts months in advance', color: 'text-white', slideFrom: 60 },
        { value: '100% Safe', label: 'Bank-Grade Security', sub: 'Your financial data stays private', color: 'text-accent-blue', slideFrom: -60 },
        { value: 'Instant', label: 'AI Money Coaching', sub: 'Get smart answers in seconds', color: 'text-emerald-400', slideFrom: 60 },
    ];

    return (
        <section className="border-y border-white/10 bg-slate-950/60 py-12 px-6 backdrop-blur-md overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {metrics.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: stat.slideFrom }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="p-5 rounded-2xl glass-panel border-white/5 hover:border-accent/30 transition-all cursor-default"
                    >
                        <div className={`text-3xl md:text-5xl font-black font-display ${stat.color} mb-1.5 drop-shadow-[0_0_15px_rgba(0,255,204,0.2)]`}>
                            {stat.value}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-200">{stat.label}</div>
                        <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default MetricsTicker;
