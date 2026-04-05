import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Authentication protocol failure');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-20 relative overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-full max-w-lg p-10 glass-panel border-white/5 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles className="w-20 h-20 text-accent" />
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center shadow-2xl shadow-accent/40 border border-white/20 mx-auto mb-6 transition-transform hover:rotate-3">
                        <span className="text-white font-black text-3xl font-display italic">F</span>
                    </div>
                    <h1 className="text-4xl font-black text-white font-display tracking-tight mb-2">
                        Welcome Back<span className="text-accent">.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Neural Access</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Identity handle</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-accent/30 focus:bg-white/10 transition-all duration-300"
                                placeholder="Username"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Cipher</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-700 focus:outline-none focus:border-accent/30 focus:bg-white/10 transition-all duration-300"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all duration-500 shadow-2xl shadow-accent/20 hover:shadow-accent/40 active:scale-[0.98] border border-white/10"
                    >
                        Synchronize Access
                    </button>
                </form>

                <div className="mt-10 text-center text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                    New Identity?{' '}
                    <Link to="/register" className="text-accent hover:text-white transition-colors ml-1 border-b border-accent/20">
                        Initialize Node
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
