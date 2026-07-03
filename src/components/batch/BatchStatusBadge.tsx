import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BatchItem } from '../../types';

interface BatchStatusBadgeProps {
  status: BatchItem['status'];
  errorMessage?: string;
}

const STATUS_CONFIG: Record<
  BatchItem['status'],
  { label: string; className: string; icon?: React.ElementType; spin?: boolean }
> = {
  pending: { label: 'Pendiente', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  processing: {
    label: 'Procesando',
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse',
    icon: Loader2,
    spin: true,
  },
  completed: { label: 'Completado', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  error: { label: 'Error', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertCircle },
};

/** Píldora de estado de un elemento del lote (pendiente/procesando/completado/error). */
export default function BatchStatusBadge({ status, errorMessage }: BatchStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      title={status === 'error' ? errorMessage : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold text-[10px] ${
        config.className
      } ${status === 'error' ? 'cursor-help' : ''}`}
    >
      {Icon && <Icon className={`w-3 h-3 ${config.spin ? 'animate-spin' : ''}`} />}
      {config.label}
    </span>
  );
}
