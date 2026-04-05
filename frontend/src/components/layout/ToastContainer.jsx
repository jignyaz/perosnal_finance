import { useNotifications } from '../../context/NotificationContext';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

const Toast = ({ notification, onRemove }) => {
    const iconMap = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const typeStyles = {
        success: 'border-emerald-500/20 bg-emerald-500/5',
        warning: 'border-amber-500/20 bg-amber-500/5',
        error: 'border-red-500/20 bg-red-500/5',
        info: 'border-blue-500/20 bg-blue-500/5'
    };

    return (
        <div className={`flex items-start gap-4 p-4 border rounded-2xl backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto min-w-[320px] max-w-md ${typeStyles[notification.type] || typeStyles.info}`}>
            <div className="mt-0.5">
                {iconMap[notification.type] || iconMap.info}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    {notification.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {notification.message}
                </p>
            </div>
            <button
                onClick={() => onRemove(notification.id)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

const ToastContainer = () => {
    const { toasts, removeToast } = useNotifications();

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} notification={toast} onRemove={removeToast} />
            ))}
        </div>,
        document.body
    );
};

export default ToastContainer;
