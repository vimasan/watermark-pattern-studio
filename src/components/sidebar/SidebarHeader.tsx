import { Sliders, RefreshCw } from 'lucide-react';

interface SidebarHeaderProps {
  isDark: boolean;
  onReset: () => void;
}

/** Cabecera de la barra lateral: título y botón de restablecer valores. */
export default function SidebarHeader({ isDark, onReset }: SidebarHeaderProps) {
  return (
    <div
      className={`p-5 border-b backdrop-blur-md flex items-center justify-between ${
        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200/60 bg-zinc-50/40'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Sliders className="w-5 h-5 text-indigo-400" />
        <h2 className="font-bold text-xs uppercase tracking-wider">Configurar Marca</h2>
      </div>
      <button
        onClick={onReset}
        className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
          isDark
            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
        }`}
        title="Restablecer valores"
        id="btn-reset-settings"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
