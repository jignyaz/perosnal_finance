import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const RecentTransactions = () => {
    const { formatMoney } = useCurrency();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await api.getTransactions();
                setTransactions(data.slice(0, 7));
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="glass-panel p-8 h-full flex flex-col border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl rounded-full"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-accent rounded-full"></div>
                    <h3 className="text-lg font-black text-white font-display tracking-tight uppercase">Ledger</h3>
                </div>
                <button className="text-[10px] font-black uppercase text-accent tracking-widest hover:text-white transition-colors">
                    Manifest All
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 relative z-10">
                {transactions.length === 0 ? (
                    <div className="text-slate-500 italic text-center py-10 text-sm">No transaction patterns detected</div>
                ) : (
                    transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-500"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg
                                    ${transaction.type === 'income'
                                        ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10'
                                        : 'bg-red-500/10 text-red-400 shadow-red-500/10'}
                                `}>
                                    {transaction.type === 'income' ? (
                                        <ArrowDownLeft className="w-5 h-5" />
                                    ) : (
                                        <ArrowUpRight className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                                        {transaction.description || transaction.category}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                        <Clock className="w-3 h-3 text-accent/60" />
                                        {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                            <div className={`text-lg font-black font-display tracking-tight ${transaction.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatMoney(transaction.amount)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
