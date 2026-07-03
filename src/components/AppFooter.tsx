import { ShieldCheck } from 'lucide-react';

interface AppFooterProps {
  isDark: boolean;
}

/**
 * Pie de página estático con indicador de ejecución local y versión.
 */
export default function AppFooter({ isDark }: AppFooterProps) {
  return (
    <footer
      className={`relative z-10 h-10 border-t px-6 flex items-center justify-between text-[10px] font-mono select-none flex-shrink-0 ${
        isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Ejecución Local Segura</span>
        </span>
      </div>
      <div>
        <span>Watermark Pattern Studio v1.0.0</span>
      </div>
    </footer>
  );
}
