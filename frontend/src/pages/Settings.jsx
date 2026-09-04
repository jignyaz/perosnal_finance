import { useState, useEffect } from 'react';
import { User, Lock, Moon, Sun, Download, Trash2, Save, CreditCard, Globe, Shield, Sparkles, Eye, EyeOff, HelpCircle, ExternalLink, Key, BookOpen, CheckCircle } from 'lucide-react';
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
    const [user, setUser] = useState({ 
        full_name: '', 
        phone_number: '', 
        dob: '', 
        email: '', 
        initial_balance: '', 
        monthly_budget: '', 
        fixed_monthly_burn: '', 
        employment_type: '', 
        financial_goal: '', 
        risk_tolerance: '', 
        gemini_api_key: '',
        groq_api_key: '',
        preferred_llm_provider: 'gemini'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [showGroqApiKey, setShowGroqApiKey] = useState(false);
    const [helpTab, setHelpTab] = useState('gemini');

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
                risk_tolerance: userData.risk_tolerance || '',
                gemini_api_key: userData.gemini_api_key || '',
                groq_api_key: userData.groq_api_key || '',
                preferred_llm_provider: userData.preferred_llm_provider || 'gemini'
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
                risk_tolerance: parseFloat(user.risk_tolerance) || 1.0,
                gemini_api_key: user.gemini_api_key || null,
                groq_api_key: user.groq_api_key || null,
                preferred_llm_provider: user.preferred_llm_provider || 'gemini'
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

                    {/* AI Configuration (BYOK) */}
                    <div className="glass-panel p-6 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            AI Configuration
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Power the AI chatbot and smart predictions with your own API keys.</p>
                        
                        <div className="space-y-4">
                            {/* Preferred Provider Selection */}
                            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                                <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block font-medium">Preferred AI Provider</label>
                                <select
                                    value={user.preferred_llm_provider}
                                    onChange={(e) => setUser({ ...user, preferred_llm_provider: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-accent/50 focus:outline-none transition-colors cursor-pointer"
                                >
                                    <option value="gemini" className="dark:bg-slate-900 font-sans">Google Gemini (Default)</option>
                                    <option value="groq" className="dark:bg-slate-900 font-sans">Groq (Llama 3)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gemini API Key Input */}
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                                    <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block font-medium">Gemini API Key</label>
                                    <div className="relative">
                                        <input
                                            type={showApiKey ? 'text' : 'password'}
                                            value={user.gemini_api_key}
                                            onChange={(e) => setUser({ ...user, gemini_api_key: e.target.value })}
                                            placeholder="AIzaSy..."
                                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-slate-900 dark:text-white focus:border-accent/50 focus:outline-none transition-colors font-mono text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        >
                                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                        Get a free key from{' '}
                                        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google AI Studio</a>.
                                    </p>
                                </div>

                                {/* Groq API Key Input */}
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                                    <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block font-medium">Groq API Key</label>
                                    <div className="relative">
                                        <input
                                            type={showGroqApiKey ? 'text' : 'password'}
                                            value={user.groq_api_key}
                                            onChange={(e) => setUser({ ...user, groq_api_key: e.target.value })}
                                            placeholder="gsk_..."
                                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-slate-900 dark:text-white focus:border-accent/50 focus:outline-none transition-colors font-mono text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowGroqApiKey(!showGroqApiKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        >
                                            {showGroqApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                        Get a key from the{' '}
                                        <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Groq Console</a>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-2">
                                {user.gemini_api_key && (
                                    <div className="flex items-center gap-2 text-xs text-emerald-500">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Gemini API key configured.
                                    </div>
                                )}
                                {user.groq_api_key && (
                                    <div className="flex items-center gap-2 text-xs text-emerald-500">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Groq API key configured.
                                    </div>
                                )}
                                {!user.gemini_api_key && !user.groq_api_key && (
                                    <div className="flex items-center gap-2 text-xs text-amber-500">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        No API keys configured — AI features disabled.
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={handleUpdateProfile}
                                    disabled={saving}
                                    className="bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-accent/20 text-sm cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save AI Settings'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Help Center & API Setup Guide */}
                    <div className="glass-panel p-6 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Help Center & API Setup
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Learn how to get your free API key and how your data stays secure.</p>

                        {/* Tabs */}
                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-5">
                            {[
                                { id: 'gemini', label: '✨ Gemini Setup', icon: null },
                                { id: 'groq', label: '⚡ Groq Setup', icon: null },
                                { id: 'privacy', label: '🔒 Privacy & Security', icon: null },
                                { id: 'faq', label: '❓ FAQ', icon: null },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setHelpTab(tab.id)}
                                    className={`flex-1 text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
                                        helpTab === tab.id
                                            ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Gemini Setup Panel */}
                        {helpTab === 'gemini' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/5 dark:to-purple-500/5 rounded-xl border border-blue-100 dark:border-blue-500/10">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Google Gemini 1.5 Flash</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Google's fast and intelligent AI model. Free tier offers 1,500 requests per day — no credit card needed.</p>
                                </div>

                                <ol className="space-y-3">
                                    {[
                                        {
                                            step: 1,
                                            title: 'Visit Google AI Studio',
                                            desc: <>Go to <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">Google AI Studio 🔗</a> and sign in with any Google account.</>,
                                        },
                                        {
                                            step: 2,
                                            title: 'Create API Key',
                                            desc: <>Click the blue <strong>"Get API key"</strong> button, then click <strong>"Create API key"</strong>. You can bind it to an existing Google Cloud project or auto-generate one.</>,
                                        },
                                        {
                                            step: 3,
                                            title: 'Copy the Key',
                                            desc: <>Copy the generated key. It will start with <span className="font-mono text-xs bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">AIzaSy...</span></>,
                                        },
                                        {
                                            step: 4,
                                            title: 'Paste in Settings Above',
                                            desc: 'Scroll up to the AI Configuration section, paste your key into the input field, and click "Save Changes".',
                                        },
                                    ].map(item => (
                                        <li key={item.step} className="flex gap-3">
                                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                                                {item.step}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                <div className="p-3 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-200 dark:border-amber-500/10">
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        <strong>⚠️ Region Note:</strong> Google AI Studio's free tier has geographic restrictions. If you're in the EU, UK, or restricted regions, the API may not work. Check Google's documentation for current availability.
                                    </p>
                                </div>

                                <a
                                    href="https://aistudio.google.com/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                >
                                    <Key className="w-4 h-4" />
                                    Get your free Gemini API key →
                                </a>
                            </div>
                        )}

                        {/* Groq Setup Panel */}
                        {helpTab === 'groq' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/5 dark:to-amber-500/5 rounded-xl border border-orange-100 dark:border-orange-500/10">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Groq Llama 3 API</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Groq offers lightning-fast inference on state-of-the-art open models like Llama 3. Their developer console provides free tier API keys.</p>
                                </div>

                                <ol className="space-y-3">
                                    {[
                                        {
                                            step: 1,
                                            title: 'Visit Groq Console',
                                            desc: <>Go to the <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">Groq Console API Keys page 🔗</a> and sign in or create an account.</>,
                                        },
                                        {
                                            step: 2,
                                            title: 'Generate API Key',
                                            desc: <>Click the <strong>"Create API Key"</strong> button, name your key (e.g. "Personal Finance Dashboard"), and click create.</>,
                                        },
                                        {
                                            step: 3,
                                            title: 'Copy the Key',
                                            desc: <>Copy the generated key immediately (it will not be shown again). It will start with <span className="font-mono text-xs bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">gsk_...</span></>,
                                        },
                                        {
                                            step: 4,
                                            title: 'Paste in Settings Above',
                                            desc: 'Scroll up to the AI Configuration section, paste your Groq key, select "Groq (Llama 3)" as preferred provider, and click "Save Changes".',
                                        },
                                    ].map(item => (
                                        <li key={item.step} className="flex gap-3">
                                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                                                {item.step}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                <a
                                    href="https://console.groq.com/keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                >
                                    <Key className="w-4 h-4" />
                                    Get your Groq API key →
                                </a>
                            </div>
                        )}

                        {/* Privacy & Security Panel */}
                        {helpTab === 'privacy' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">How BYOK (Bring Your Own Key) Protects You</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Your API key is used exclusively for your account's AI features. Here's how we keep it safe.</p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            icon: '🔒',
                                            title: 'AES-256 Encryption at Rest',
                                            desc: 'Your API key is encrypted using industry-standard AES-256 (Fernet) encryption with PBKDF2-HMAC-SHA256 key derivation (480,000 iterations) before being stored in the database.',
                                        },
                                        {
                                            icon: '🛡️',
                                            title: 'Masked in API Responses',
                                            desc: 'Your key is never returned in full from the server. API responses show only a masked version (e.g., AIza...227E) so it cannot be intercepted.',
                                        },
                                        {
                                            icon: '🔑',
                                            title: 'Per-User Isolation',
                                            desc: 'Each user stores their own key. Your key is only used for your requests — it is never shared with other users or used for any purpose other than calling the Gemini API on your behalf.',
                                        },
                                        {
                                            icon: '🚫',
                                            title: 'No Third-Party Access',
                                            desc: 'Your API requests go directly from our server to Google\'s Gemini API. No middleman, analytics service, or third-party ever sees your key or your queries.',
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQ Panel */}
                        {helpTab === 'faq' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                                {[
                                    {
                                        q: 'Is the Gemini API completely free?',
                                        a: 'Yes! Google AI Studio offers a generous free tier with up to 1,500 requests per day and 1 million tokens per minute. No credit card is required to sign up.',
                                    },
                                    {
                                        q: 'What if I get "Invalid API Key" error?',
                                        a: 'Ensure you copied the full key starting with AIzaSy... from Google AI Studio. Also verify you\'re pasting a Gemini key (not a different Google Cloud service key).',
                                    },
                                    {
                                        q: 'What happens if I don\'t add a key?',
                                        a: 'The app works perfectly without an API key — you just won\'t have access to the AI chatbot and AI-enhanced expense predictions. All other features (transactions, budgets, analytics) work normally.',
                                    },
                                    {
                                        q: 'Can I change or remove my key later?',
                                        a: 'Absolutely. You can update or clear your API key anytime from this Settings page. Simply clear the field and click "Save Changes".',
                                    },
                                    {
                                        q: 'Is my financial data sent to Google?',
                                        a: 'Only anonymized summaries (monthly totals, category breakdowns) are sent as context for the AI chat. No raw transaction descriptions, bank details, or personal identifiers are ever transmitted.',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white flex items-start gap-2">
                                            <HelpCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                            {item.q}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-6">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}
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
