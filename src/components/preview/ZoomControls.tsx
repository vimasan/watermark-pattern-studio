import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  isDark: boolean;
  zoomLevel: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onReset: () => void;
}

/** Controles flotantes de zoom (acercar/alejar/restablecer) de la vista previa. */
export default function ZoomControls({
  isDark,
  zoomLevel,
  minZoom,
  maxZoom,
  defaultZoom,
  onZoomOut,
  onZoomIn,
  onReset,
}: ZoomControlsProps) {
  return (
    <div
      className={`absolute bottom-6 right-6 flex items-center gap-1 p-1.5 rounded-full border shadow-xl backdrop-blur-md z-30 transition-all ${
        isDark ? 'bg-zinc-900/90 border-white/10 text-white' : 'bg-white/95 border-zinc-200/80 text-slate-800'
      }`}
    >
      <button
        id="zoom-out-btn"
        onClick={onZoomOut}
        disabled={zoomLevel <= minZoom}
        className={`p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
        }`}
        title="Alejar (Zoom -)"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <span className="text-[11px] font-mono font-bold px-2 min-w-[48px] text-center select-none">{zoomLevel}%</span>
      <button
        id="zoom-in-btn"
        onClick={onZoomIn}
        disabled={zoomLevel >= maxZoom}
        className={`p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
        }`}
        title="Acercar (Zoom +)"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      <div className={`w-px h-4 mx-1 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
      <button
        id="zoom-reset-btn"
        onClick={onReset}
        disabled={zoomLevel === defaultZoom}
        className={`p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
        }`}
        title="Restablecer (100%)"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
