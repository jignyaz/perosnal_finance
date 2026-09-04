import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingHeader = () => {
    const { user } = useAuth();

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'AI Assistant', href: '#ai-assistant' },
        { label: 'Calculator', href: '#calculator' },
        { label: 'Security', href: '#security' },
        { label: 'FAQ', href: '#faq' },
    ];

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="sticky top-0 z-50 backdrop-blur-2xl bg-[#020b14]/85 border-b border-white/5 transition-all shadow-2xl shadow-black/60"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-accent/25 border border-white/20 transition-all duration-300"
                    >
                        <span className="text-slate-950 font-black text-2xl font-display italic">₹</span>
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1.5">
                            Finance<span className="text-accent font-black">AI</span>
                        </span>
                        <span className="text-[9px] font-bold text-emerald-400/80 tracking-[0.2em] uppercase -mt-1 font-mono">
                            Analytics & Intelligence
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
                    {navItems.map((item) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            whileHover={{ y: -2, color: '#00ffcc' }}
                            transition={{ duration: 0.2 }}
                            className="hover:text-accent transition-colors relative group py-1"
                        >
                            {item.label}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                    ))}
                </nav>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-4">
                    {/* Currency Indicator */}
                    <div className="hidden sm:flex items-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 shadow-inner">
                        <span className="text-xs font-black text-emerald-400 mr-1.5 font-display">₹</span>
                        <span className="text-xs font-bold text-white">INR (₹)</span>
                    </div>

                    {user ? (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-accent/30 transition-all border border-white/20"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Go to Dashboard</span>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    to="/login"
                                    className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-3 py-2 transition-colors"
                                >
                                    Log In
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-accent/30 transition-all border border-white/20"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

export default LandingHeader;
