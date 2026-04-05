import { useState } from 'react';
import { Plus, Calendar, Clock, Tag, DollarSign, Type } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const AddExpenseForm = ({ onAddExpense }) => {
    const { addNotification } = useNotifications();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        description: '',
        category: 'Food',
        amount: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.description || !formData.amount) return;

        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`);

        onAddExpense({
            ...formData,
            amount: parseFloat(formData.amount),
            date: dateTime.toISOString(),
            // ID handled by backend
        });

        // Reset form partially
        setFormData(prev => ({ ...prev, description: '', amount: '' }));

        addNotification('Transaction Added', `Successfully added ${formData.category} expense: $${formData.amount}`, 'success');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                Add New Expense
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Date</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-secondary/50 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-white"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Time</label>
                    <div className="relative group">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full bg-secondary/50 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-white"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-slate-400 ml-1">Description</label>
                    <div className="relative group">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            name="description"
                            placeholder="e.g. Grocery Shopping"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-secondary/50 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-white placeholder-slate-600"
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Category</label>
                    <div className="relative group">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-secondary/50 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-white appearance-none cursor-pointer"
                        >
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Housing">Housing</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                    </div>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Amount</label>
                    <div className="relative group">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                        <input
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full bg-secondary/50 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-white placeholder-slate-600"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 mt-2 active:scale-[0.98]"
            >
                Add Transaction
            </button>
        </form>
    );
};

export default AddExpenseForm;
