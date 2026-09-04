import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Alex R.',
            role: 'Software Engineer',
            initial: 'AR',
            color: 'cyan',
            text: 'The future expense predictions are amazing. It caught an upcoming yearly car insurance payment that I completely forgot about. Saved me from being short on cash.'
        },
        {
            name: 'Sarah K.',
            role: 'Product Manager',
            initial: 'SK',
            color: 'purple',
            text: 'Finally a budgeting app that is actually private and doesnt spam me with credit card ads. The AI chat assistant helped me find $120/month in unused subscriptions.'
        },
        {
            name: 'David V.',
            role: 'Small Business Owner',
            initial: 'DV',
            color: 'emerald',
            text: 'Uploading my bank PDF statements took less than 5 seconds. The dark mode dashboard and future expense graph makes planning my monthly budget effortless.'
        },
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 overflow-hidden">
            {/* Header - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-2xl mx-auto mb-16"
            >
                <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight mb-4">
                    Loved By Smart Savers
                </h2>
                <p className="text-slate-300 text-sm">
                    Read how everyday savers use our smart dashboard to grow their savings.
                </p>
            </motion.div>

            {/* Testimonials - Slide in from Left and Right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i === 0 ? -80 : i === 1 ? 0 : 80, y: i === 1 ? 40 : 0 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                        whileHover={{ y: -8, scale: 1.03 }}
                        className="glass-panel p-7 rounded-3xl border-white/10 bg-white/5 hover:border-accent/30 transition-all flex flex-col justify-between shadow-2xl"
                    >
                        <div>
                            <div className="flex text-amber-400 mb-4 gap-1">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} className="w-4 h-4 fill-current animate-pulse" />
                                ))}
                            </div>
                            <p className="text-sm text-slate-200 leading-relaxed mb-6 italic">
                                "{card.text}"
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                            <div className={`w-10 h-10 rounded-full bg-${card.color}-500/20 border border-${card.color}-500/40 flex items-center justify-center font-black text-${card.color}-400`}>
                                {card.initial}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white font-display">{card.name}</div>
                                <div className="text-xs text-slate-400">{card.role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
