import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [newBudget, setNewBudget] = useState({ title: '', amount: '', due_date: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        try {
            const data = await api.getBudgets();
            setBudgets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newBudget.title || !newBudget.amount || !newBudget.due_date) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // Ensure date is in ISO format slightly to avoid parsing issues, though standard date input usually provides YYYY-MM-DD which requests often handle. 
            // Explicitly ensuring ISO string might be safer for python datetime.
            const budgetData = {
                ...newBudget,
                amount: parseFloat(newBudget.amount),
                due_date: new Date(newBudget.due_date).toISOString(),
                is_paid: false
            };

            await api.createBudget(budgetData);
            setNewBudget({ title: '', amount: '', due_date: '' });
            loadBudgets();
            alert("Budget added successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to add budget: " + error.message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-display font-bold text-white">Planned Payments</h2>
                <p className="text-slate-400">Manage your upcoming bills and important payments.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-accent" />
                            Add New Payment
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newBudget.title}
                                    onChange={(e) => setNewBudget({ ...newBudget, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-accent/50 focus:outline-none"
                                    placeholder="e.g., Rent, Electricity"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newBudget.amount}
                                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-accent/50 focus:outline-none"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newBudget.due_date}
                                    onChange={(e) => setNewBudget({ ...newBudget, due_date: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-accent/50 focus:outline-none"
                                    required
                                />
                            </div>
                            <button className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-accent/20">
                                Add Payment
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="text-slate-400">Loading...</div>
                    ) : budgets.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-slate-400">
                            No planned payments yet. Add one to get started!
                        </div>
                    ) : (
                        budgets.map((item) => (
                            <div key={item.id} className="glass-panel p-4 flex items-center justify-between group hover:border-accent/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.is_paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                        {item.is_paid ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                        <div className="text-sm text-slate-400">
                                            Due: {new Date(item.due_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-white">${item.amount.toFixed(2)}</div>
                                    <div className={`text-sm ${item.is_paid ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {item.is_paid ? 'Paid' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;
