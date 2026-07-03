import { Sparkles } from 'lucide-react';
import { WATERMARK_PRESETS } from '../../constants/watermarkPresets';

interface PresetSelectorProps {
  isDark: boolean;
  onApply: (presetKey: string) => void;
}

/** Cuadrícula de plantillas rápidas de marca de agua. */
export default function PresetSelector({ isDark, onApply }: PresetSelectorProps) {
  return (
    <div className="space-y-2.5">
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Plantillas Rápidas
      </span>
      <div className="grid grid-cols-2 gap-2.5">
        {WATERMARK_PRESETS.map((preset) => (
          <button
            key={preset.key}
            id={preset.buttonId}
            onClick={() => onApply(preset.key)}
            className={`py-2 px-3 text-left text-xs rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
              isDark
                ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20'
                : 'border-zinc-200 bg-white hover:bg-zinc-100/70 hover:border-zinc-300/80'
            }`}
          >
            <div className={`font-bold ${preset.accentClass}`}>{preset.label}</div>
            <div className={`text-[9px] opacity-50 mt-0.5 ${preset.descriptionClassName ?? ''}`}>
              {preset.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
