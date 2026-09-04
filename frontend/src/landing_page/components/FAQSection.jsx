import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        {
            question: "How does the AI predict my future spending?",
            answer: "The app looks at your recurring regular bills (like rent, utilities, and subscriptions), learns your usual habits (like weekend food and shopping), and takes into account upcoming seasonal changes to accurately show you how much you'll spend in the next 1 to 6 months."
        },
        {
            question: "Is my financial information safe and private?",
            answer: "Yes, 100%. We use bank-level encryption (AES-256) to protect your account. We never sell your personal information to third parties or advertisers."
        },
        {
            question: "Can I upload bank statements directly?",
            answer: "Yes! You can drag and drop PDF or CSV statements from almost any bank. The app automatically reads the dates, figures out categories like groceries and dining, and adds them to your dashboard in seconds."
        },
        {
            question: "Does it support different currencies?",
            answer: "Yes, you can easily switch between US Dollars ($), Euros (€), Indian Rupees (₹), British Pounds (£), and Japanese Yen (¥). All figures update automatically with live exchange rates."
        },
        {
            question: "How does the AI Chat Assistant help me?",
            answer: "You can ask it anything about your money in plain words — like 'How can I save $200 this month?' or 'How much will I spend next month?' It gives you practical, personalized suggestions based on your real spending."
        }
    ];

    return (
        <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/10 overflow-hidden">
            {/* Header - Slides in from Left */}
            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
                    <HelpCircle className="w-3.5 h-3.5 text-accent animate-bounce-slow" />
                    <span>Frequently Asked Questions</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
                    Got Questions? We Have Answers
                </h2>
            </motion.div>

            {/* Alternating FAQ Items sliding from sides */}
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.25, 1, 0.5, 1] }}
                        className="glass-panel rounded-2xl border-white/10 bg-white/5 overflow-hidden transition-all duration-300 hover:border-accent/30"
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        >
                            <span className="font-bold text-white text-base pr-4 font-display">
                                {faq.question}
                            </span>
                            <motion.div
                                animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                            {openFaq === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
