interface BatchStats {
  total: number;
  pending: number;
  completed: number;
  error: number;
}

interface BatchStatsBarProps {
  isDark: boolean;
  stats: BatchStats;
}

const STAT_ITEMS: Array<{ key: keyof BatchStats; label: string; colorClass: string }> = [
  { key: 'total', label: 'Total', colorClass: 'text-indigo-400' },
  { key: 'pending', label: 'Pendientes', colorClass: 'text-slate-400' },
  { key: 'completed', label: 'Completadas', colorClass: 'text-emerald-400' },
  { key: 'error', label: 'Errores', colorClass: 'text-rose-500' },
];

/** Franja de estadísticas resumidas del lote (total/pendientes/completadas/errores). */
export default function BatchStatsBar({ isDark, stats }: BatchStatsBarProps) {
  return (
    <div
      className={`grid grid-cols-4 gap-4 p-4 rounded-2xl mb-5 text-center text-xs font-semibold backdrop-blur-md border ${
        isDark ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-100/60 border-zinc-200/50'
      }`}
    >
      {STAT_ITEMS.map(({ key, label, colorClass }) => (
        <div key={key}>
          <div className="text-[10px] uppercase opacity-50 tracking-wider">{label}</div>
          <div className={`text-lg font-bold mt-0.5 ${colorClass}`}>{stats[key]}</div>
        </div>
      ))}
    </div>
  );
}
