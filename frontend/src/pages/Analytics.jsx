import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../services/api';
import { TrendingUp, PieChart as PieChartIcon, Sparkles, AlertTriangle } from 'lucide-react';
import AIAdvisor from '../components/AIAdvisor';

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);
    const [predictionData, setPredictionData] = useState(null);
    const [predictionV2, setPredictionV2] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [txnData, predData, predV2] = await Promise.all([
                api.getTransactions(),
                api.getPrediction().catch(() => null),
                api.getPredictionV2().catch(() => null)
            ]);
            setTransactions(txnData);
            setPredictionData(predData);
            setPredictionV2(predV2);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Expenses by Category
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value,
    }));

    // Calculate Monthly Average or Trend (Simplistic daily for now based on data)
    // Group by date text for chart
    const trendDataMap = transactions.reduce((acc, t) => {
        const dateStr = new Date(t.date).toLocaleDateString();
        if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
        if (t.type === 'income') acc[dateStr].income += t.amount;
        else acc[dateStr].expense += t.amount;
        return acc;
    }, {});

    // Sort by date roughly
    const trendData = Object.values(trendDataMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Use v2 prediction if available (LangChain enhanced), fallback to v1
    const activePrediction = predictionV2 || predictionData;
    const ai = predictionV2?.ai_enhancement;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-display font-bold text-white">Analytics</h2>
                <p className="text-slate-400">Deep dive into your financial data.</p>
            </div>

            {loading ? (
                <div className="text-slate-400">Loading analysis...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Breakdown */}
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-accent" />
                            Expense Breakdown
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Spend Trend */}
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Income vs Expense Trend
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {/* AI Spend Prediction */}
                        <div className="glass-panel p-6 lg:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-accent" />
                                    AI Expense Forecast (6 Months)
                                </h3>
                                {/* AI Method Badge */}
                                {activePrediction?.method && (
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                                        ai?.langchain_active
                                            ? 'bg-accent/20 text-accent border border-accent/30'
                                            : 'bg-slate-700 text-slate-300'
                                    }`}>
                                        {ai?.langchain_active && <Sparkles className="w-3 h-3" />}
                                        {ai?.langchain_active ? 'Gemini Enhanced' : 'Ensemble Model'}
                                    </span>
                                )}
                            </div>

                            {/* AI Reasoning row */}
                            {ai?.langchain_active && (
                                <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                                    <Sparkles className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300">{ai.reasoning}</p>
                                        {ai.adjustment_percent !== 0 && (
                                            <span className={`text-xs font-semibold mt-1 inline-block ${
                                                ai.adjustment_percent < 0 ? 'text-emerald-400' : 'text-amber-400'
                                            }`}>
                                                {ai.adjustment_percent > 0 ? '▲' : '▼'} {Math.abs(ai.adjustment_percent).toFixed(1)}% adjustment applied
                                            </span>
                                        )}
                                    </div>
                                    {ai.risk_flag && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                                </div>
                            )}

                            {activePrediction && activePrediction.predictions ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={activePrediction.predictions}>
                                            <defs>
                                                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Predicted']}
                                            />
                                            <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#38bdf8" fillOpacity={0.1} />
                                            <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#0F172A" fillOpacity={1} />
                                            <Area type="monotone" dataKey="predicted_amount" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorPrediction)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl">
                                    <p className="text-slate-500">Not enough data for accurate predictions yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Advisor with prediction context */}
            <AIAdvisor predictionData={predictionV2} />
        </div>
    );
};

export default Analytics;
