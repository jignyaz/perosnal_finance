import { motion } from 'framer-motion';

const FinancialBackground = () => {
    // Continuously rising floating Indian Rupee (₹) particles with varying speeds, sizes, and paths
    const floatingRupees = [
        { id: 1, left: '6%', size: 'text-6xl', opacity: 0.14, duration: 18, delay: 0, xOffset: [0, 25, -20, 0] },
        { id: 2, left: '18%', size: 'text-4xl', opacity: 0.18, duration: 14, delay: 3, xOffset: [0, -20, 15, 0] },
        { id: 3, left: '32%', size: 'text-8xl', opacity: 0.08, duration: 24, delay: 1, xOffset: [0, 30, -30, 0] },
        { id: 4, left: '48%', size: 'text-5xl', opacity: 0.12, duration: 16, delay: 5, xOffset: [0, -15, 25, 0] },
        { id: 5, left: '62%', size: 'text-7xl', opacity: 0.10, duration: 22, delay: 2, xOffset: [0, 35, -25, 0] },
        { id: 6, left: '78%', size: 'text-4xl', opacity: 0.16, duration: 15, delay: 4, xOffset: [0, -25, 20, 0] },
        { id: 7, left: '88%', size: 'text-8xl', opacity: 0.09, duration: 20, delay: 6, xOffset: [0, 20, -20, 0] },
        { id: 8, left: '94%', size: 'text-5xl', opacity: 0.13, duration: 17, delay: 1, xOffset: [0, -30, 15, 0] },
        { id: 9, left: '12%', size: 'text-9xl', opacity: 0.06, duration: 28, delay: 8, xOffset: [0, 40, -40, 0] },
        { id: 10, left: '70%', size: 'text-6xl', opacity: 0.11, duration: 19, delay: 7, xOffset: [0, -20, 30, 0] },
    ];

    // Dynamic candlestick columns with breathing and pulsing animations
    const candlestickCols = [
        { left: '3%', height: [120, 150, 110, 140, 120], color: 'bg-emerald-400/20 border-emerald-400/40', wick: 'h-10' },
        { left: '7%', height: [80, 110, 95, 75, 80], color: 'bg-cyan-400/20 border-cyan-400/40', wick: 'h-8' },
        { left: '11%', height: [160, 190, 140, 180, 160], color: 'bg-emerald-400/25 border-emerald-400/50', wick: 'h-12' },
        { left: '15%', height: [100, 130, 115, 90, 100], color: 'bg-teal-400/20 border-teal-400/40', wick: 'h-6' },
        { left: '83%', height: [110, 140, 100, 130, 110], color: 'bg-cyan-400/20 border-cyan-400/40', wick: 'h-8' },
        { left: '87%', height: [150, 180, 135, 175, 150], color: 'bg-emerald-400/25 border-emerald-400/50', wick: 'h-12' },
        { left: '91%', height: [200, 230, 180, 220, 200], color: 'bg-emerald-300/30 border-emerald-300/60', wick: 'h-14' },
        { left: '95%', height: [95, 125, 85, 115, 95], color: 'bg-teal-400/20 border-teal-400/40', wick: 'h-7' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
            {/* 1. Deep Layered Financial Ambient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020b14] via-[#041424] to-[#010912]" />

            {/* 2. Continuously Moving Financial Grid (Matrix Drift) */}
            <motion.div
                animate={{
                    backgroundPosition: ['0px 0px', '48px 48px'],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute inset-0 opacity-[0.16]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 255, 204, 0.18) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 255, 204, 0.18) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* 3. Moving Volumetric Financial Light Orbs */}
            <motion.div
                animate={{
                    x: [0, 80, -40, 0],
                    y: [0, -60, 50, 0],
                    scale: [1, 1.25, 0.9, 1],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 left-1/4 w-[750px] h-[750px] bg-emerald-500/12 blur-[190px] rounded-full"
            />
            <motion.div
                animate={{
                    x: [0, -70, 50, 0],
                    y: [0, 60, -50, 0],
                    scale: [1, 1.2, 1.3, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 right-5 w-[650px] h-[650px] bg-cyan-500/14 blur-[180px] rounded-full"
            />
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -40, 40, 0],
                    scale: [1, 1.35, 1],
                    opacity: [0.08, 0.18, 0.08],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 left-1/3 w-[900px] h-[600px] bg-teal-400/12 blur-[210px] rounded-full"
            />

            {/* 4. Dynamic Live Candlesticks with Breathing Market Movement */}
            <div className="absolute top-16 left-0 right-0 h-[650px] opacity-45">
                {candlestickCols.map((candle, idx) => (
                    <div
                        key={idx}
                        className="absolute bottom-24 flex flex-col items-center"
                        style={{ left: candle.left }}
                    >
                        {/* Upper Wick */}
                        <div className={`w-[1px] bg-emerald-400/50 ${candle.wick}`} />
                        {/* Animated Candle Body */}
                        <motion.div
                            animate={{ height: candle.height }}
                            transition={{
                                duration: 8 + idx * 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className={`w-3.5 sm:w-4 rounded-sm border backdrop-blur-md shadow-[0_0_15px_rgba(0,255,204,0.25)] ${candle.color}`}
                        />
                        {/* Lower Wick */}
                        <div className={`w-[1px] bg-emerald-400/50 ${candle.wick}`} />
                    </div>
                ))}
            </div>

            {/* 5. Flowing Market Trend Waves with Moving Dash Lines & Glowing Scanner Beam */}
            <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 1440 900">
                <defs>
                    <linearGradient id="liveWaveGrad1" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.0" />
                        <stop offset="50%" stopColor="#00ffcc" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="liveWaveGrad2" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.0" />
                        <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.7" />
                    </linearGradient>
                </defs>

                {/* Animated Flowing Market Line 1 */}
                <path
                    d="M 0 750 C 300 720, 600 580, 900 480 C 1150 400, 1300 220, 1440 120"
                    fill="none"
                    stroke="url(#liveWaveGrad1)"
                    strokeWidth="3"
                    className="animate-wave-dash"
                />

                {/* Animated Flowing Market Line 2 */}
                <path
                    d="M 0 850 C 350 820, 700 680, 1050 520 C 1250 420, 1350 310, 1440 240"
                    fill="none"
                    stroke="url(#liveWaveGrad2)"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                />
            </svg>

            {/* 6. Continuously Rising & Floating Indian Rupee (₹) Glyphs */}
            {floatingRupees.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{
                        y: '-20vh',
                        x: p.xOffset,
                        rotate: [-12, 12, -12],
                        opacity: [0, p.opacity, p.opacity * 1.3, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                    style={{
                        position: 'absolute',
                        left: p.left,
                    }}
                    className={`${p.size} font-black font-display text-emerald-400 drop-shadow-[0_0_25px_rgba(0,255,204,0.5)] pointer-events-none`}
                >
                    <span>₹</span>
                </motion.div>
            ))}

            {/* 7. Dual Continuous Financial Market Ticker Streams */}
            <div className="absolute top-24 left-0 right-0 overflow-hidden opacity-15 text-[10px] font-mono tracking-widest text-cyan-300 whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1400] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                >
                    NIFTY ▲ +1.4% • RUPEE INDEX ▲ +₹450 • CASHFLOW RESERVE ▲ +₹2,85,000 • PREDICTIVE MODEL ACCURACY 95.8% • AI EXPENSE OPTIMIZATION ACTIVE • LIQUIDITY INDEX ▲ +14.2% •
                    NIFTY ▲ +1.4% • RUPEE INDEX ▲ +₹450 • CASHFLOW RESERVE ▲ +₹2,85,000 • PREDICTIVE MODEL ACCURACY 95.8% • AI EXPENSE OPTIMIZATION ACTIVE • LIQUIDITY INDEX ▲ +14.2% •
                </motion.div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 overflow-hidden opacity-20 text-[11px] font-mono tracking-widest text-emerald-300 whitespace-nowrap">
                <motion.div
                    animate={{ x: [-1400, 0] }}
                    transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                >
                    FINANCE-AI ANALYTICS • MONTHLY SAVINGS ▲ +₹18,400 • RECURRING BILLS ▼ -₹4,200 • PREDICTION ACCURACY 95.2% • LIQUIDITY RESERVE ▲ +₹1,45,000 • ANOMALY SHIELD ACTIVE • MONTHLY CASHFLOW VELOCITY ▲ +14.8% • FORECAST HORIZON: 6 MONTHS • 
                    FINANCE-AI ANALYTICS • MONTHLY SAVINGS ▲ +₹18,400 • RECURRING BILLS ▼ -₹4,200 • PREDICTION ACCURACY 95.2% • LIQUIDITY RESERVE ▲ +₹1,45,000 • ANOMALY SHIELD ACTIVE • MONTHLY CASHFLOW VELOCITY ▲ +14.8% • FORECAST HORIZON: 6 MONTHS •
                </motion.div>
            </div>
        </div>
    );
};

export default FinancialBackground;
