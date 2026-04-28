import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';

const AIAdvisor = ({ predictionData }) => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI financial advisor powered by Gemini. Ask me anything about your spending, budget, or predictions!"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [insightsOpen, setInsightsOpen] = useState(true);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.chat(input, window.location.pathname);
            setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I couldn't connect to the AI. Make sure GOOGLE_API_KEY is set in your .env file."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const ai = predictionData?.ai_enhancement;
    const hasInsights = ai && ai.langchain_active;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* Chat Panel */}
            {open && (
                <div className="w-[360px] h-[480px] glass-panel border border-white/10 flex flex-col overflow-hidden shadow-2xl"
                    style={{ borderRadius: '1rem' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-accent/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">Finance AI</div>
                                <div className="text-accent text-xs flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Powered by Gemini
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-accent text-white rounded-br-none'
                                        : 'bg-white/10 text-slate-200 rounded-bl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 px-4 py-2 rounded-xl rounded-bl-none">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask about your spending..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-accent/50"
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()}
                            className="bg-accent hover:bg-accent/80 disabled:opacity-40 text-white p-2 rounded-xl transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* AI Insights Card (shown when prediction data has langchain) */}
            {hasInsights && !open && (
                <div className="w-[320px] glass-panel border border-accent/20 p-4 shadow-xl"
                    style={{ borderRadius: '1rem' }}>
                    <button
                        onClick={() => setInsightsOpen(!insightsOpen)}
                        className="w-full flex items-center justify-between text-white mb-2">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Sparkles className="w-4 h-4 text-accent" />
                            Gemini AI Insights
                            {ai.risk_flag && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        </div>
                        {insightsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {insightsOpen && (
                        <div className="space-y-2">
                            <p className="text-slate-300 text-xs leading-relaxed">{ai.reasoning}</p>

                            {ai.adjustment_percent !== 0 && (
                                <div className={`text-xs px-2 py-1 rounded-lg inline-flex items-center gap-1 font-medium ${
                                    ai.adjustment_percent < 0
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                    {ai.adjustment_percent > 0 ? '▲' : '▼'}
                                    {Math.abs(ai.adjustment_percent).toFixed(1)}% Adjustment Applied
                                </div>
                            )}

                            {ai.category_insights?.length > 0 && (
                                <ul className="space-y-1 mt-2">
                                    {ai.category_insights.map((insight, i) => (
                                        <li key={i} className="text-xs text-slate-400 flex items-start gap-1">
                                            <span className="text-accent mt-0.5">•</span> {insight}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent rounded-full"
                                        style={{ width: `${(ai.confidence * 100).toFixed(0)}%` }} />
                                </div>
                                <span className="text-xs text-slate-400">{(ai.confidence * 100).toFixed(0)}% confident</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    open ? 'bg-slate-700 rotate-12' : 'bg-accent hover:bg-accent/90 hover:scale-110'
                }`}>
                {open ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
            </button>
        </div>
    );
};

export default AIAdvisor;
