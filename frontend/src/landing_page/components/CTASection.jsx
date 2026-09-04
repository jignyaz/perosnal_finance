import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CTASection = () => {
    const { user } = useAuth();

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="relative rounded-3xl p-10 sm:p-16 glass-panel border-accent/40 bg-gradient-to-br from-accent/15 via-slate-950/90 to-emerald-500/20 text-center overflow-hidden shadow-2xl shadow-accent/25"
            >
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center shadow-xl shadow-accent/30 border border-white/20 mx-auto mb-6"
                    >
                        <Sparkles className="w-8 h-8 text-slate-950" />
                    </motion.div>

                    <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight mb-6">
                        Ready To Make Smarter Money Decisions?
                    </h2>

                    <p className="text-slate-300 text-base mb-10 max-w-xl mx-auto leading-relaxed">
                        Create your account in less than a minute. Start tracking your bills, predicting future expenses, and building your savings today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
                            <Link
                                to={user ? "/dashboard" : "/register"}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm uppercase tracking-wider px-10 py-5 rounded-2xl shadow-2xl shadow-accent/40 transition-all border border-white/20"
                            >
                                <Zap className="w-5 h-5 fill-current animate-bounce-slow" />
                                <span>{user ? "Open Your Dashboard" : "Register Now — It's Free"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-6 py-4 rounded-xl border border-white/10 hover:border-white/25 transition-all block bg-white/5"
                            >
                                Already have an account? Log In
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CTASection;
