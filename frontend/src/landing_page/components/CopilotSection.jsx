import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle2, Send } from 'lucide-react';

const CopilotSection = () => {
    const samplePrompts = [
        {
            title: "How much will I spend next month?",
            prompt: "How much will I spend next month based on my habits?",
            reply: "Looking at your regular monthly bills and recent dining trends, you are projected to spend about ₹31,200 next month. That is ₹1,400 lower than last month because your car insurance EMI was completed."
        },
        {
            title: "How can I save an extra ₹3,000?",
            prompt: "How can I easily save an extra ₹3,000 this month?",
            reply: "You have 3 unused OTT & gym subscriptions totaling ₹780/month that you haven't used in 60 days. Also, reducing food delivery orders on weekends will easily save another ₹2,250/month."
        },
        {
            title: "Is my emergency fund big enough?",
            prompt: "Do I have enough money saved for emergencies?",
            reply: "Your fixed monthly expenses are ₹18,500. We recommend keeping at least 3 to 6 months of living costs (₹55,500 – ₹1,11,000) in emergency savings. You are currently at 88% of your ideal goal!"
        }
    ];

    const [activePromptIndex, setActivePromptIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [displayedReply, setDisplayedReply] = useState(samplePrompts[0].reply);

    const handleSelectPrompt = (index) => {
        if (activePromptIndex === index && isTyping) return;
        setActivePromptIndex(index);
        setIsTyping(true);
        setDisplayedReply("");
        let currentText = "";
        const fullText = samplePrompts[index].reply;
        let charIndex = 0;

        const interval = setInterval(() => {
            if (charIndex < fullText.length) {
                currentText += fullText.charAt(charIndex);
                setDisplayedReply(currentText);
                charIndex += 2;
            } else {
                setDisplayedReply(fullText);
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 12);
    };

    return (
        <section id="ai-assistant" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Description - Slides in from Left */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="lg:col-span-5 space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Bot className="w-3.5 h-3.5 animate-bounce-slow" />
                        <span>Your AI Money Coach</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
                        Get Instant Answers <br />
                        <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                            About Your Money
                        </span>
                    </h2>

                    <p className="text-slate-300 text-base leading-relaxed">
                        No confusing financial jargon or generic tips. Your AI assistant looks directly at your actual bills and goals to give you personalized, easy-to-follow money advice.
                    </p>

                    <div className="space-y-3 pt-2">
                        {[
                            "Understands your actual spending and upcoming bills",
                            "Alerts you to forgotten subscriptions and price hikes",
                            "Provides simple, step-by-step savings suggestions in Rupees (₹)"
                        ].map((point, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 6 }}
                                className="flex items-center gap-3 text-sm font-semibold text-slate-200"
                            >
                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                                <span>{point}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Live Interactive Chat Simulator - Slides in from Right */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="lg:col-span-7"
                >
                    <div className="glass-panel rounded-3xl border-white/15 p-6 bg-slate-950/80 shadow-2xl relative">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-accent/20"
                                >
                                    <Bot className="w-5 h-5 text-slate-950 font-bold" />
                                </motion.div>
                                <div>
                                    <div className="text-sm font-bold text-white font-display">AI Financial Assistant</div>
                                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                        Online • Ready to help
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                Try An Example
                            </span>
                        </div>

                        {/* Prompt Chips */}
                        <div className="space-y-2 mb-6">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Click a question to test:</div>
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.map((item, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => handleSelectPrompt(idx)}
                                        className={`text-xs px-3.5 py-2 rounded-xl transition-all border text-left font-medium ${activePromptIndex === idx
                                            ? 'bg-accent/20 border-accent text-white shadow-lg shadow-accent/20 font-bold'
                                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {item.title}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Conversation Bubble Preview */}
                        <div className="space-y-4 mb-4 min-h-[160px]">
                            {/* User Message */}
                            <motion.div
                                key={`user-${activePromptIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-end"
                            >
                                <div className="bg-accent/20 border border-accent/40 text-white text-xs font-semibold px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-md">
                                    {samplePrompts[activePromptIndex].prompt}
                                </div>
                            </motion.div>

                            {/* Assistant Message */}
                            <motion.div
                                key={`assistant-${activePromptIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/5 border border-white/10 text-slate-200 text-xs leading-relaxed px-5 py-4 rounded-2xl rounded-tl-none max-w-[90%] relative shadow-lg">
                                    <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                                        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                                        <span>AI Assistant</span>
                                    </div>
                                    <p className="text-slate-200 text-sm">{displayedReply}</p>
                                    {isTyping && (
                                        <span className="inline-block w-2 h-3.5 bg-accent ml-1 animate-pulse"></span>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Mock Input Bar */}
                        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                            <input
                                type="text"
                                disabled
                                placeholder="Ask any question about your budget..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                            />
                            <button
                                disabled
                                className="p-2.5 bg-accent/30 text-slate-950 rounded-xl cursor-not-allowed"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CopilotSection;
