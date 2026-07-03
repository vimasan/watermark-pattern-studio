import { ElementType } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastState, ToastVariant } from '../hooks/useToast';

interface ToastProps {
  toast: ToastState;
  isDark: boolean;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: ElementType; textDark: string; textLight: string; iconColor: string }
> = {
  success: { icon: CheckCircle, textDark: 'text-emerald-400', textLight: 'text-emerald-600', iconColor: 'text-emerald-500' },
  error: { icon: AlertCircle, textDark: 'text-red-400', textLight: 'text-red-600', iconColor: 'text-red-500' },
  info: { icon: Info, textDark: 'text-indigo-400', textLight: 'text-indigo-600', iconColor: 'text-indigo-500' },
};

/**
 * Notificación flotante no intrusiva situada en la esquina inferior derecha.
 */
export default function Toast({ toast, isDark }: ToastProps) {
  const { icon: Icon, textDark, textLight, iconColor } = VARIANT_STYLES[toast.variant];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div
        className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border backdrop-blur-xl ${
          isDark
            ? `bg-zinc-900/90 border-white/10 ${textDark} shadow-black/40`
            : `bg-white/90 border-zinc-200 ${textLight} shadow-zinc-300/40`
        }`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
