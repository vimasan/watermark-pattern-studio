import { Type, Image as ImageIcon } from 'lucide-react';
import { WatermarkSettings } from '../../types';

interface WatermarkTypeToggleProps {
  isDark: boolean;
  type: WatermarkSettings['type'];
  onChange: (type: WatermarkSettings['type']) => void;
}

/** Selector del tipo de marca de agua: texto o imagen/logotipo. */
export default function WatermarkTypeToggle({ isDark, type, onChange }: WatermarkTypeToggleProps) {
  const activeClass = isDark
    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
    : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20';
  const inactiveClass = 'opacity-60 hover:opacity-100 text-slate-400 hover:text-slate-200';

  return (
    <div className="space-y-2.5">
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Tipo de Marca</span>
      <div
        className={`grid grid-cols-2 p-1 rounded-xl border ${
          isDark ? 'bg-black/40 border-white/5' : 'bg-slate-200/30 border-zinc-200/30'
        }`}
      >
        <button
          id="type-text-btn"
          onClick={() => onChange('text')}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            type === 'text' ? activeClass : inactiveClass
          }`}
        >
          <Type className="w-4 h-4" />
          Texto
        </button>
        <button
          id="type-image-btn"
          onClick={() => onChange('image')}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            type === 'image' ? activeClass : inactiveClass
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Logotipo / Imagen
        </button>
      </div>
    </div>
  );
}
