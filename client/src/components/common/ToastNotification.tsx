import React from 'react';
import { useNotification, ToastMessage } from '../../contexts/NotificationContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-terracotta-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-gold-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-mutedblue-600 shrink-0" />,
    xp: <Sparkles className="w-5 h-5 text-gold-500 fill-gold-500 shrink-0 animate-bounce" />,
  };

  const bgStyles = {
    success: 'bg-cream-50 border-forest-500 shadow-forest-900/10',
    error: 'bg-terracotta-50 border-terracotta-400 shadow-terracotta-900/10',
    warning: 'bg-gold-50 border-gold-400 shadow-gold-900/10',
    info: 'bg-mutedblue-50 border-mutedblue-400 shadow-mutedblue-900/10',
    xp: 'bg-gradient-to-r from-gold-50 to-cream-50 border-gold-500 shadow-gold-900/20',
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-2 shadow-lg backdrop-blur-md
        transition-all duration-300 transform translate-y-0
        ${bgStyles[toast.type]}
      `}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm">
        {toast.title && <h4 className="font-bold text-teal-900 font-display">{toast.title}</h4>}
        <p className="text-teal-700 font-medium leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-teal-400 hover:text-teal-700 p-0.5 rounded-lg transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
