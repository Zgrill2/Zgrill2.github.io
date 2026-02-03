import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, ToastType } from '../context/ToastContext';

const TOAST_STYLES: Record<ToastType, { border: string; icon: typeof Info }> = {
  success: { border: 'border-success', icon: CheckCircle },
  error: { border: 'border-error', icon: XCircle },
  warning: { border: 'border-warning', icon: AlertTriangle },
  info: { border: 'border-cyan-electric', icon: Info },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type];
        const Icon = style.icon;
        return (
          <button
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-lg bg-navy-mid border-2 ${style.border} shadow-panel cursor-pointer ${
              toast.isExiting ? 'animate-toast-out' : 'animate-toast-in'
            }`}
          >
            <Icon size={20} className="shrink-0" />
            <span className="text-cosmic-white text-sm font-medium">{toast.message}</span>
          </button>
        );
      })}
    </div>
  );
}
