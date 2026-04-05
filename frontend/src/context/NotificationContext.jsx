import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    // Load from localStorage or start empty
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem('notifications');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [toasts, setToasts] = useState([]);

    // Save to localStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Add a new notification
    // type: 'success' | 'warning' | 'error' | 'info'
    const addNotification = (title, message, type = 'info') => {
        const id = Date.now().toString();
        const newNotification = {
            id,
            title,
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        // Add to permanent notifications
        setNotifications(prev => [newNotification, ...prev].slice(0, 50));

        // Add to active toasts
        const newToast = { ...newNotification, autoDismiss: true };
        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss toast after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            toasts,
            addNotification,
            removeToast,
            markAsRead,
            markAllAsRead,
            clearAll,
            unreadCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
