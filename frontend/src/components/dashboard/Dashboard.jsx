import { DollarSign, Wallet, TrendingUp, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import ExpenseTrendChart from './ExpenseTrendChart';
import RecentTransactions from './RecentTransactions';
import PredictionCard from './PredictionCard';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';

import PlaidLink from './PlaidLink';

const Dashboard = () => {
    const { user, refreshUser } = useAuth();
    const { formatMoney } = useCurrency();
    const { addNotification } = useNotifications();
    const [stats, setStats] = useState({
        total_expenses: 0,
        net_worth: 0,
        transaction_count: 0,
        monthly_budget: 0
    });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, txnsData] = await Promise.all([
                    api.getStats(),
                    api.getTransactions()
                ]);
                setStats(statsData);
                setTransactions(txnsData);

                // Check for budget alerts
                if (statsData.monthly_budget > 0) {
                    const percentage = (statsData.total_expenses / statsData.monthly_budget) * 100;
                    const budgetAlertKey = `budget_alert_${new Date().getMonth()}`;

                    if (percentage >= 100 && !sessionStorage.getItem(budgetAlertKey)) {
                        addNotification(
                            'Budget Exceeded!',
                            `You have exceeded your monthly budget of ${formatMoney(statsData.monthly_budget)}`,
                            'error'
                        );
                        sessionStorage.setItem(budgetAlertKey, 'exceeded');
                    } else if (percentage >= 80 && !sessionStorage.getItem(budgetAlertKey)) {
                        addNotification(
                            'Approaching Budget Limit',
                            `You have used ${percentage.toFixed(0)}% of your monthly budget.`,
                            'warning'
                        );
                        sessionStorage.setItem(budgetAlertKey, 'approaching');
                    }
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Operational Overview</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <h2 className="text-5xl font-display font-black text-white tracking-tighter">
                            Dashboard<span className="text-accent">.</span>
                        </h2>
                        {!user?.plaid_access_token && (
                            <PlaidLink onSuccess={refreshUser} />
                        )}
                    </div>
                    <p className="text-slate-500 font-medium mt-2 max-w-md leading-relaxed">
                        Welcome back, <span className="text-slate-300">{user?.full_name || user?.username}</span>. Your financial matrix is currently <span className="text-emerald-400 font-bold">stabilized</span>.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Gross Burn"
                    value={formatMoney(stats.total_expenses)}
                    trend="up"
                    trendValue="12.5%"
                    icon={DollarSign}
                    color="text-accent"
                />
                <StatCard
                    title="Net Liquidity"
                    value={formatMoney(stats.net_worth)}
                    trend="up"
                    trendValue="6.1%"
                    icon={Wallet}
                    color="text-emerald-500"
                    to="/settings"
                />
                <StatCard
                    title="Target Allocation"
                    value={formatMoney(stats.monthly_budget)}
                    trend="down"
                    trendValue={(stats.monthly_budget - stats.total_expenses) > 0
                        ? `${((stats.monthly_budget - stats.total_expenses) / stats.monthly_budget * 100).toFixed(0)}% Left`
                        : 'Overlimit'}
                    icon={TrendingUp}
                    color="text-purple-500"
                    to="/settings"
                />
                <StatCard
                    title="Active Ledger"
                    value={stats.transaction_count}
                    trend="down"
                    trendValue="Transactions"
                    icon={CreditCard}
                    color="text-orange-400"
                />
            </div>

            {/* Main Cognitive Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <PredictionCard />
                    <div className="glass-panel p-8 min-h-[450px] border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                            Temporal Spending Velocity
                        </h3>
                        <div className="h-[350px]">
                            <ExpenseTrendChart transactions={transactions} />
                        </div>
                    </div>
                </div>
                <div className="h-full">
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
