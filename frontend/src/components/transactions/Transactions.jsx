import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { api } from '../../services/api';
import AddExpenseForm from './AddExpenseForm';
import { useCurrency } from '../../context/CurrencyContext';
import { useNotifications } from '../../context/NotificationContext';

const Transactions = () => {
    const { formatMoney } = useCurrency();
    const { addNotification } = useNotifications();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, []);

    const checkBudgetLimit = async () => {
        try {
            const stats = await api.getStats();
            if (stats.monthly_budget > 0) {
                const percentage = (stats.total_expenses / stats.monthly_budget) * 100;
                if (percentage >= 100) {
                    addNotification(
                        'Budget Exceeded!',
                        `Warning: Your total expenses (${formatMoney(stats.total_expenses)}) have exceeded your monthly budget of ${formatMoney(stats.monthly_budget)}.`,
                        'error'
                    );
                } else if (percentage >= 80) {
                    addNotification(
                        'Budget Warning',
                        `You have used ${percentage.toFixed(0)}% of your monthly budget. Current spending: ${formatMoney(stats.total_expenses)}.`,
                        'warning'
                    );
                }
            }
        } catch (error) {
            console.error("Budget check failed", error);
        }
    };

    const loadTransactions = async () => {
        try {
            const data = await api.getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const response = await api.uploadTransactions(file);
            
            // Clear input so selecting the same file again triggers onChange
            event.target.value = '';

            let msg = response.message;
            if (response.warnings && response.warnings.length > 0) {
                msg += `\n\nWarnings (some rows skipped):\n` + response.warnings.join('\n');
            }
            
            alert(msg);
            await loadTransactions();
            await checkBudgetLimit();
        } catch (error) {
            console.error('Upload failed:', error);
            // Clear input on error too
            event.target.value = '';
            alert('Upload failed: ' + error.message);
        }
    };

    const handleAddExpense = async (newExpense) => {
        try {
            const expenseData = {
                ...newExpense,
                type: 'expense'
            };
            await api.createTransaction(expenseData);
            setShowAddForm(false);
            await loadTransactions();
            await checkBudgetLimit();
        } catch (error) {
            console.error('Failed to add expense:', error);
            alert(`Failed to add expense: ${error.message} `);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white">Transactions</h2>
                    <p className="text-slate-400">Manage and track your expenses.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-medium transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Manual</span>
                    </button>
                    <label className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-accent/20 cursor-pointer">
                        <Plus className="w-5 h-5" />
                        <span>Upload CSV</span>
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            {/* Add Expense Form Area */}
            {showAddForm && (
                <div className="mb-8">
                    <AddExpenseForm onAddExpense={handleAddExpense} />
                </div>
            )}

            {/* Transactions List */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-400">Loading...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-400">No transactions found. Upload a CSV to get started.</td></tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {transaction.description || "No Description"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className={`px - 6 py - 4 whitespace - nowrap text - sm font - bold text - right ${transaction.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'} `}>
                                            {transaction.type === 'income' ? '+' : '-'}{formatMoney(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium ${transaction.type === 'income'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-red-500/10 text-red-500'
                                                } `}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
