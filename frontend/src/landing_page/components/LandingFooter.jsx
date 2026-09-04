import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingFooter = () => {
    return (
        <footer className="border-t border-white/10 bg-[#020b14]/95 py-16 px-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12"
            >
                {/* Col 1 & 2: Brand */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center shadow-lg border border-white/15">
                            <span className="text-slate-950 font-black text-xl font-display italic">₹</span>
                        </div>
                        <span className="text-xl font-bold font-display text-white">
                            Finance<span className="text-accent">AI</span>
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                        Smart personal finance app with future expense forecasting, context-aware AI money assistant, and bank-grade privacy encryption.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>All Systems Active & Secure</span>
                    </div>
                </div>

                {/* Col 3: Product */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">Features</div>
                    <ul className="space-y-2 text-xs text-slate-400">
                        <li><a href="#how-it-works" className="hover:text-accent transition-colors">Future Expense Forecast</a></li>
                        <li><a href="#ai-assistant" className="hover:text-accent transition-colors">AI Money Assistant</a></li>
                        <li><a href="#calculator" className="hover:text-accent transition-colors">Savings Calculator</a></li>
                        <li><a href="#features" className="hover:text-accent transition-colors">Feature Comparison</a></li>
                    </ul>
                </div>

                {/* Col 4: Security */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">Security</div>
                    <ul className="space-y-2 text-xs text-slate-400">
                        <li><a href="#security" className="hover:text-accent transition-colors">Bank-Level Encryption</a></li>
                        <li><span className="text-slate-500">100% Private Data</span></li>
                        <li><span className="text-slate-500">No Ads or Data Selling</span></li>
                        <li><span className="text-slate-500">Private AI Keys</span></li>
                    </ul>
                </div>

                {/* Col 5: Access */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">Get Started</div>
                    <ul className="space-y-2 text-xs text-slate-400">
                        <li><Link to="/login" className="hover:text-accent transition-colors">Sign In</Link></li>
                        <li><Link to="/register" className="hover:text-accent transition-colors">Create Account</Link></li>
                        <li><Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link></li>
                        <li><a href="#faq" className="hover:text-accent transition-colors">Help & FAQ</a></li>
                    </ul>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div>
                    © {new Date().getFullYear()} FinanceAI. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                    <a href="#security" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#security" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
