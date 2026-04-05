import { useState, useEffect } from 'react';
import { User, Lock, Moon, Sun, Download, Trash2, Save, CreditCard, Globe, Shield } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNotifications } from '../context/NotificationContext';

const Settings = () => {
    const { refreshUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { currency, updateCurrency } = useCurrency();
    const { addNotification } = useNotifications();
    const [user, setUser] = useState({ full_name: '', phone_number: '', dob: '', email: '', initial_balance: '', monthly_budget: '', fixed_monthly_burn: '', employment_type: '', financial_goal: '', risk_tolerance: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await api.getCurrentUser();
            setUser({
                full_name: userData.full_name || '',
                phone_number: userData.phone_number || '',
                dob: userData.dob ? userData.dob.split('T')[0] : '',
                email: userData.email || '',
                initial_balance: userData.initial_balance || '',
                monthly_budget: userData.monthly_budget || '',
                fixed_monthly_burn: userData.fixed_monthly_burn || '',
                employment_type: userData.employment_type || '',
                financial_goal: userData.financial_goal || '',
                risk_tolerance: userData.risk_tolerance || ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.updateUser({
                ...user,
                dob: user.dob ? new Date(user.dob).toISOString() : null,
                initial_balance: parseFloat(user.initial_balance) || 0,
                monthly_budget: parseFloat(user.monthly_budget) || 0,
                fixed_monthly_burn: parseFloat(user.fixed_monthly_burn) || 0,
                risk_tolerance: parseFloat(user.risk_tolerance) || 1.0
            });
            await refreshUser();
            setSuccessMessage('Settings updated successfully');
            addNotification('Settings Updated', 'Your profile and budget settings have been saved.', 'success');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update settings:', error);
            addNotification('Update Failed', 'Could not save settings. Please try again.', 'error');
        } finally {
            setSaving(false); // Changed from setLoading(false) to setSaving(false) to match original logic
        }
    };

    const handleResetData = async () => {
        if (confirm('Are you sure you want to delete ALL transactions? This action cannot be undone.')) {
            try {
                await api.deleteTransactions();
                alert('All data has been reset.');
            } catch (error) {
                console.error(error);
                alert('Failed to reset data');
            }
        }
    };

    const handleExportData = async () => {
        try {
            const transactions = await api.getTransactions();
            const csvContent = "data:text/csv;charset=utf-8,"
                + "Date,Description,Category,Amount,Type\n"
                + transactions.map(t => `${t.date},${t.description},${t.category},${t.amount},${t.type}`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "transactions_backup.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            alert('Failed to export data');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
            <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your profile and preferences.</p>
            </div>

            {loading ? (
                <div className="text-slate-500 dark:text-slate-400">Loading settings...</div>
            ) : (
                <div className="space-y-8">

                    {/* Profile Settings */}
                    <div className="glass-panel p-6 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-accent" />
                            Profile Information
                        </h3>
                        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={user.full_name}
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={user.phone_number}
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Date of Birth</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={user.dob}
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Initial Balance</label>
                                <input
                                    type="number"
                                    value={user.initial_balance}
                                    onChange={(e) => setUser({ ...user, initial_balance: e.target.value })}
                                    placeholder="e.g. 5000.00"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:border-accent/50 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Monthly Budget Goal</label>
                                <input
                                    type="number"
                                    value={user.monthly_budget}
                                    onChange={(e) => setUser({ ...user, monthly_budget: e.target.value })}
                                    placeholder="e.g. 2000.00"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:border-accent/50 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Email (Read Only)</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-500 dark:text-slate-500 cursor-not-allowed transition-colors"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-accent/20">
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* App Preferences */}
                    <div className="glass-panel p-6 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-purple-500" />
                            App Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 dark:bg-white/10 p-2 rounded-lg">
                                        {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                                    </div>
                                    <div>
                                        <div className="text-slate-900 dark:text-white font-medium">Appearance</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className="text-sm bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white px-4 py-2 rounded-lg transition-colors font-medium"
                                >
                                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 dark:bg-white/10 p-2 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-slate-900 dark:text-white font-medium">Currency</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Change display currency</div>
                                    </div>
                                </div>
                                <select
                                    value={currency.code}
                                    onChange={(e) => updateCurrency(e.target.value)}
                                    className="bg-slate-200 dark:bg-white/10 border-none text-slate-700 dark:text-white text-sm rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer font-medium"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="glass-panel p-6 bg-white dark:bg-white/5 border-red-200 dark:border-red-500/20 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" />
                            Data Management
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 dark:bg-white/10 p-2 rounded-lg">
                                        <Download className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-slate-900 dark:text-white font-medium">Export Data</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Download a copy of your data</div>
                                    </div>
                                </div>
                                <button onClick={handleExportData} className="text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg transition-colors font-medium">
                                    Download CSV
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-200 dark:border-red-500/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 dark:bg-red-500/10 p-2 rounded-lg">
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-slate-900 dark:text-white font-medium">Reset Data</div>
                                        <div className="text-xs text-red-500/80 dark:text-red-400">Permanently delete all transactions</div>
                                    </div>
                                </div>
                                <button onClick={handleResetData} className="text-sm bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 px-4 py-2 rounded-lg transition-colors font-medium">
                                    Delete All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
