import {
  Paintbrush,
  Square,
  EyeOff,
  Grid,
  Undo,
  Trash2
} from 'lucide-react';
import { ACTIVE_DRAWING, DrawingMode, INACTIVE_DRAWING, Redaction } from '../types';

interface DrawingToolbarProps {
  activeMode: DrawingMode;
  setActiveMode: (mode: DrawingMode) => void;
  currentTool: 'brush' | 'rect' | 'blur' | 'pixelate';
  setCurrentTool: (tool: 'brush' | 'rect' | 'blur' | 'pixelate') => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentSize: number;
  setCurrentSize: (size: number) => void;
  redactions: Redaction[];
  undo: () => void;
  clear: () => void;
  isDark: boolean;
}

export default function DrawingToolbar({
  activeMode,
  setActiveMode,
  currentTool,
  setCurrentTool,
  currentColor,
  setCurrentColor,
  currentSize,
  setCurrentSize,
  redactions,
  undo,
  clear,
  isDark
}: DrawingToolbarProps) {
  const toggleMode = () => {
    setActiveMode(activeMode === ACTIVE_DRAWING ? INACTIVE_DRAWING : ACTIVE_DRAWING);
  }

  return (
    <div className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-md z-20 ${
      isDark ? 'bg-zinc-950/60 border-white/5' : 'bg-slate-100/60 border-zinc-200'
    }`}>
      {/* Mode toggle tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/10 dark:bg-black/35 border border-white/5">
        <button
          id="mode-preview-btn"
          onClick={toggleMode}
          className={`flex items-center gap-1 px-3.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
            activeMode === ACTIVE_DRAWING
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Herramientas</span>
        </button>
      </div>

      {/* Conditional Redact controls */}
      {activeMode === ACTIVE_DRAWING && (
        <div className="w-full flex items-center flex-wrap gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/10 dark:bg-black/25">
              <button
                id="tool-rect-btn"
                onClick={() => setCurrentTool('rect')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currentTool === 'rect' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400'
                }`}
                title="Caja opaca sólida para cubrir información"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Rectángulo</span>
              </button>
              <button
                id="tool-brush-btn"
                onClick={() => setCurrentTool('brush')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currentTool === 'brush' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400'
                }`}
                title="Pincel libre sólido"
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>Pincel</span>
              </button>
              <button
                id="tool-blur-btn"
                onClick={() => setCurrentTool('blur')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currentTool === 'blur' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400'
                }`}
                title="Caja de desenfoque"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Desenfocar</span>
              </button>
              <button
                id="tool-pixelate-btn"
                onClick={() => setCurrentTool('pixelate')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currentTool === 'pixelate' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400'
                }`}
                title="Caja de pixelado"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Pixelar</span>
              </button>
            </div>
          </div>

          {/* Color picker (Only for rect/brush) */}
          {(currentTool === 'rect' || currentTool === 'brush') && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Color:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { color: '#000000', label: 'Negro' },
                  { color: '#ffffff', label: 'Blanco' },
                  { color: '#ef4444', label: 'Rojo' },
                  { color: '#eab308', label: 'Amarillo' },
                  { color: '#3b82f6', label: 'Azul' },
                ].map(item => (
                  <button
                    key={item.color}
                    onClick={() => setCurrentColor(item.color)}
                    className={`w-5 h-5 rounded-full border cursor-pointer relative transition-transform ${
                      currentColor === item.color ? 'scale-125 border-indigo-500' : 'border-zinc-500/30 hover:scale-110'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.label}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size parameter (Only for brush tool) */}
          {currentTool === 'brush' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Grosor:</span>
              <input
                type="range"
                min="5"
                max="80"
                value={currentSize}
                onChange={(e) => setCurrentSize(parseInt(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer h-1.5 rounded-lg bg-zinc-700"
              />
              <span className="font-mono text-[11px] w-8">{currentSize}px</span>
            </div>
          )}

          {/* Undo/Clear action controls */}
          <div className="flex items-center gap-1.5 border-l border-zinc-700/50 pl-4 ml-1">
            <button
              id="draw-undo-btn"
              onClick={undo}
              disabled={redactions.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Deshacer último trazo"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Deshacer</span>
            </button>
            <button
              id="draw-clear-btn"
              onClick={clear}
              disabled={redactions.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-900/20 border border-red-500/20 hover:bg-red-900/40 disabled:opacity-30 disabled:pointer-events-none text-red-400 hover:text-red-300 transition-all cursor-pointer"
              title="Eliminar todo"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar Todo</span>
            </button>
          </div>
        </div>
      )}

      {activeMode === ACTIVE_DRAWING && (
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-zinc-400 select-none bg-red-500/5 px-2.5 py-1 rounded-md border border-red-500/10 font-mono">
          <span>● Arrastre sobre la imagen para ocultar elementos (No se aplicarán en el proceso por lotes)</span>
        </div>
      )}
    </div>
  );
}