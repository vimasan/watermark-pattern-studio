import { Loader2 } from 'lucide-react';

/**
 * Overlay de bloqueo mostrado mientras se renderiza la exportación en alta resolución.
 */
export default function ExportOverlay() {
  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center p-8 bg-zinc-950/80 border border-white/15 rounded-3xl max-w-sm mx-auto shadow-2xl shadow-black/80 flex flex-col items-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
        <h3 className="text-base font-bold text-white mb-1">Renderizando en Alta Definición</h3>
        <p className="text-xs text-zinc-400">
          Procesando mosaico a máxima resolución de píxeles para mantener la calidad 100%. Por favor, espere un
          momento...
        </p>
      </div>
    </div>
  );
}
