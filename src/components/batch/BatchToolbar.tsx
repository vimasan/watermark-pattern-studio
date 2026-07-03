import { Play, Download, Trash2, Loader2 } from 'lucide-react';

interface BatchToolbarProps {
  isDark: boolean;
  hasItems: boolean;
  processingAll: boolean;
  pendingCount: number;
  completedCount: number;
  onProcessAll: () => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
}

/** Cabecera de la vista de lote: título, descripción y botones de acción. */
export default function BatchToolbar({
  isDark,
  hasItems,
  processingAll,
  pendingCount,
  completedCount,
  onProcessAll,
  onDownloadAll,
  onClearAll,
}: BatchToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Procesamiento por Lotes</h2>
        <p className="text-xs opacity-60 mt-1">
          Arrastra múltiples imágenes, ajusta la marca de agua y procésalas todas en un solo paso con máxima
          resolución.
        </p>
      </div>

      {hasItems && (
        <div className="flex flex-wrap gap-2.5">
          <button
            id="batch-process-all-btn"
            onClick={onProcessAll}
            disabled={processingAll || pendingCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white transition-all shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105"
          >
            {processingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Procesar Pendientes ({pendingCount})</span>
              </>
            )}
          </button>

          <button
            id="batch-download-all-btn"
            onClick={onDownloadAll}
            disabled={completedCount === 0 || processingAll}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 text-white transition-all shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Completadas ({completedCount})</span>
          </button>

          <button
            id="batch-clear-all-btn"
            onClick={onClearAll}
            disabled={processingAll}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full border hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all cursor-pointer ${
              isDark ? 'border-white/10 text-slate-300 bg-white/5' : 'border-zinc-200 text-zinc-600 bg-white'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpiar Todo</span>
          </button>
        </div>
      )}
    </div>
  );
}
