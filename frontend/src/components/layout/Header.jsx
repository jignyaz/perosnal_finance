import { Bell, Search, X, Check } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title = "Dashboard" }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- Search Logic ---
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    const searchablePages = [
        { name: 'Dashboard', path: '/' },
        { name: 'Transactions', path: '/transactions' },
        { name: 'Budgets', path: '/budgets' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Settings', path: '/settings' }
    ];

    const filteredPages = searchablePages.filter(page =>
        page.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && filteredPages.length > 0) {
            navigate(filteredPages[0].path);
            setShowSearch(false);
            setSearchQuery('');
        }
    };

    const handleSearchSelect = (path) => {
        navigate(path);
        setShowSearch(false);
        setSearchQuery('');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (id) => {
        markAsRead(id);
    };

    return (
        <header className="h-24 flex items-center justify-between px-8 z-40 relative">
            <div className="flex-1 max-w-4xl">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-white font-display tracking-tight transition-all duration-500">
                        {title}
                        <span className="text-accent ml-1 text-4xl">.</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-5 glass-panel px-6 py-3 border-white/5 shadow-2xl shadow-black/20">
                <div className="relative hidden lg:block group" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-all duration-300" />
                    <input
                        type="text"
                        placeholder="Neural Search..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearch(true);
                        }}
                        onFocus={() => setShowSearch(true)}
                        onKeyDown={handleSearchSubmit}
                        className="bg-white/5 border border-white/5 rounded-2xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/30 focus:bg-white/10 transition-all w-48 focus:w-72 text-white placeholder-slate-510"
                    />

                    {/* Search Results Dropdown */}
                    {showSearch && searchQuery && (
                        <div className="absolute top-full left-0 mt-3 w-full glass-panel border-white/10 shadow-2xl overflow-hidden z-50 p-2">
                            {filteredPages.length > 0 ? (
                                filteredPages.map((page, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSearchSelect(page.path)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        {page.name}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-2.5 text-sm text-slate-500 italic">
                                    No cognitive matches
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-accent/20 text-accent' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Bell className="w-5.5 h-5.5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-white shadow-[0_0_10px_rgba(139,92,246,0.5)] border border-white/20">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isOpen && (
                        <div className="absolute right-0 mt-4 w-96 glass-panel border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-50 p-1">
                            <div className="p-4 flex items-center justify-between border-b border-white/5 mb-1">
                                <h3 className="font-bold text-white font-display">Neural Alerts</h3>
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <button onClick={markAllAsRead} className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors" title="Acknowledge all">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    {notifications.length > 0 && (
                                        <button onClick={clearAll} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors" title="Purge all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-10 text-center text-slate-500 text-sm italic">
                                        Collective consciousness is clear
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className={`p-4 group rounded-xl hover:bg-white/5 transition-all cursor-pointer relative mb-1 ${!notification.read ? 'bg-accent/5' : ''}`}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-bold tracking-tight mb-1 ${!notification.read ? 'text-white' : 'text-slate-400'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-[10px] font-bold text-accent/60 mt-2 block tracking-widest uppercase">
                                                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(139,92,246,0.8)] mt-1.5"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div
                    onClick={() => navigate('/settings')}
                    className="h-10 w-10 rounded-2xl bg-gradient-to-br from-accent to-accent-blue p-[1px] cursor-pointer hover:scale-105 transition-all duration-300 group"
                    title="User Node Settings"
                >
                    <div className="w-full h-full rounded-[15px] bg-slate-950 overflow-hidden border border-white/5 flex items-center justify-center">
                        <div className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: 'url(https://api.dicebear.com/7.x/shapes/svg?seed=gowtham)' }}></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
