import { MouseEvent, RefObject, TouchEvent } from 'react';
import { ACTIVE_DRAWING, DrawingMode } from '@/src/types';


interface PreviewCanvasProps {
  isDark: boolean;
  canvasRef: RefObject<HTMLCanvasElement>;
  zoomLevel: number;
  loading: boolean;
  activeMode?: DrawingMode;
  onMouseDown?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove?: (e: TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd?: (e: TouchEvent<HTMLCanvasElement>) => void;
}

/** Lienzo de la vista previa con fondo de damero (para visualizar transparencia) y overlay de carga. */
export default function PreviewCanvas({ isDark, canvasRef, zoomLevel, loading, activeMode, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd }: PreviewCanvasProps) {
  return (
    <div className="relative group max-w-full max-h-full flex items-center justify-center">
      <div
        className={`rounded-2xl p-2.5 border transition-all duration-150 ease-out ${
          isDark ? 'bg-black/50 border-white/10' : 'bg-white border-zinc-200 shadow-xl shadow-zinc-200/20'
        }`}
        style={{
          backgroundImage: 'conic-gradient(#808080 25%, white 0 50%, #808080 0 75%, white 0)',
          backgroundSize: '16px 16px',
          backgroundPosition: 'center',
          transform: `scale(${zoomLevel / 100})`,
          transition: 'center center',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onDragStart={(e) => e.preventDefault()}
          className={`max-w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-240px)] object-contain rounded-xl block select-none`}
          style={{
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            cursor: activeMode === ACTIVE_DRAWING ? 'crosshair' : 'default',
            touchAction: activeMode === ACTIVE_DRAWING ? 'none' : 'auto'
          }}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-200 font-semibold">Actualizando vista previa...</span>
          </div>
        </div>
      )}
    </div>
  );
}
