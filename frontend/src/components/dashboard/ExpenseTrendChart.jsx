import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

const CustomTooltip = ({ active, payload, label, currency }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-4 border-white/10 shadow-2xl bg-slate-950/80 backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
                <p className="text-xl font-black text-white font-display tracking-tight">
                    {currency.symbol}{payload[0].value.toLocaleString()}
                </p>
                <div className="mt-2 h-0.5 w-full bg-accent/20 rounded-full"></div>
            </div>
        );
    }
    return null;
};

const ExpenseTrendChart = ({ transactions = [] }) => {
    const { currency } = useCurrency();

    const chartData = useMemo(() => {
        if (!transactions) return [];

        const expenses = transactions.filter(t => t.type === 'expense');

        // Anchor to latest transaction date or today
        const anchorDate = expenses.length > 0
            ? new Date(Math.max(...expenses.map(t => new Date(t.date))))
            : new Date();

        const startDate = new Date(anchorDate);
        startDate.setDate(anchorDate.getDate() - 13); // 14 day window

        // Group expenses by day
        const dailyMap = {};
        expenses.forEach(t => {
            const dateStr = new Date(t.date).toISOString().split('T')[0];
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + t.amount;
        });

        // Generate full 14-day sequence
        const data = [];
        for (let i = 0; i <= 13; i++) {
            const current = new Date(startDate);
            current.setDate(startDate.getDate() + i);
            const key = current.toISOString().split('T')[0];

            data.push({
                name: current.toLocaleDateString(undefined, { month: 'short', day: '2-digit' }),
                amount: dailyMap[key] || 0,
                fullDate: key
            });
        }

        return data;
    }, [transactions]);

    return (
        <div className="w-full h-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `${currency.symbol}${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                        />
                        <Tooltip
                            content={<CustomTooltip currency={currency} />}
                            cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#8b5cf6"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', shadow: '0 0 10px rgba(139,92,246,0.8)' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                    <div className="w-20 h-20 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse"></div>
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest">Awaiting Transaction Ingest</span>
                </div>
            )}
        </div>
    );
};

export default ExpenseTrendChart;
