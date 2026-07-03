import { Download, Eye } from 'lucide-react';

interface PreviewToolbarProps {
  isDark: boolean;
  fileName: string | null;
  hasImage: boolean;
  sizeLabel?: string;
  onDownload: () => void;
}

/** Barra superior de la vista previa: nombre de archivo, resolución y botón de exportar. */
export default function PreviewToolbar({ isDark, fileName, hasImage, sizeLabel, onDownload }: PreviewToolbarProps) {
  return (
    <div
      className={`h-14 px-5 border-b flex items-center justify-between flex-shrink-0 backdrop-blur-md transition-all ${
        isDark ? 'bg-white/[0.02] border-white/10 text-slate-100' : 'bg-white/60 border-zinc-200/60 text-slate-800'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Eye className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span className="text-xs font-bold tracking-wide truncate">
          {fileName ? `Vista Previa: ${fileName}` : 'Vista Previa en Tiempo Real'}
        </span>
        {sizeLabel && (
          <span
            className={`hidden md:inline px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
              isDark ? 'bg-white/5 text-slate-300 border border-white/5' : 'bg-slate-200/50 text-slate-600 border border-zinc-200/30'
            }`}
          >
            Resolución Original: {sizeLabel}
          </span>
        )}
      </div>

      {hasImage && (
        <button
          id="download-preview-btn"
          onClick={onDownload}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>
      )}
    </div>
  );
}
