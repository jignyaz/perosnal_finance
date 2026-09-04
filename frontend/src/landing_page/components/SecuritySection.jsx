import { motion } from 'framer-motion';
import { Lock, Key, FileSpreadsheet, Globe } from 'lucide-react';

const SecuritySection = () => {
    return (
        <section id="security" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 overflow-hidden">
            {/* Header - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Lock className="w-3.5 h-3.5 animate-bounce-slow" />
                    <span>Safety & Privacy First</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight mb-4">
                    Your Money Data Stays <br />
                    <span className="text-accent-blue">100% Private & Protected</span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                    Your financial details belong to you alone. We use the highest level of bank encryption to protect your privacy at all times.
                </p>
            </motion.div>

            {/* 3 Feature Cards - Slide in from Left and Right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Security Card 1 */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="glass-panel p-8 rounded-3xl border-white/15 bg-white/5 hover:border-accent/40 transition-all flex flex-col justify-between shadow-2xl"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-6 shadow-lg shadow-accent/20">
                            <Key className="w-6 h-6 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">Private AI (Your Own Key)</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            You can connect your own Google AI key. All keys and data are encrypted using military-grade security so no one else can ever see them.
                        </p>
                    </div>
                    <div className="text-xs font-bold text-accent bg-accent/10 p-3 rounded-xl border border-accent/20">
                        🔒 Military-Grade AES-256 Encryption
                    </div>
                </motion.div>

                {/* Security Card 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="glass-panel p-8 rounded-3xl border-white/15 bg-white/5 hover:border-accent-blue/40 transition-all flex flex-col justify-between shadow-2xl"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-6 shadow-lg shadow-accent-blue/20">
                            <FileSpreadsheet className="w-6 h-6 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">1-Click Bank Statement Upload</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            Simply drag & drop statements from Chase, Bank of America, Wells Fargo, or any local bank. The app automatically organizes all your spending.
                        </p>
                    </div>
                    <div className="text-xs font-bold text-accent-blue bg-accent-blue/10 p-3 rounded-xl border border-accent-blue/20">
                        📄 Automatic Date & Category Detection
                    </div>
                </motion.div>

                {/* Security Card 3 */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="glass-panel p-8 rounded-3xl border-white/15 bg-white/5 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-2xl"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20">
                            <Globe className="w-6 h-6 animate-spin-slow" />
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">Multi-Currency & Rewards</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            Switch instantly between USD ($), EUR (€), INR (₹), GBP (£), and JPY (¥). Earn fun reward points every time you log your expenses!
                        </p>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        ⚡ 5 Global Currencies & Streak Points
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SecuritySection;
