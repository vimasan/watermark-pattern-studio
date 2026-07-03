import ToggleSwitch from '../ui/ToggleSwitch';
import SliderControl from '../ui/SliderControl';
import { WatermarkSettings } from '../../types';

interface SpiralControlsProps {
  isDark: boolean;
  settings: WatermarkSettings;
  onToggleSpiral: () => void;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
}

/** Activador y parámetros del efecto de texto en espiral. */
export default function SpiralControls({ isDark, settings, onToggleSpiral, onUpdate }: SpiralControlsProps) {
  return (
    <div
      className={`mt-4 p-3 rounded-xl border ${
        isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50/50'
      } space-y-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold">Efecto Espiral de Texto</span>
          <span className="text-[10px] opacity-60">Dibuja el texto en espiral desde un punto</span>
        </div>
        <ToggleSwitch id="watermark-spiral-toggle" checked={!!settings.textSpiral} onChange={onToggleSpiral} />
      </div>

      {settings.textSpiral && (
        <div className={`space-y-3 pt-2 border-t border-dashed ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
          <SliderControl
            id="watermark-spiral-x-range"
            label="Centro X (Horizontal)"
            value={settings.textSpiralX ?? 50}
            displayValue={`${settings.textSpiralX ?? 50}%`}
            min={0}
            max={100}
            onChange={(v) => onUpdate('textSpiralX', v)}
            compact
          />
          <SliderControl
            id="watermark-spiral-y-range"
            label="Centro Y (Vertical)"
            value={settings.textSpiralY ?? 50}
            displayValue={`${settings.textSpiralY ?? 50}%`}
            min={0}
            max={100}
            onChange={(v) => onUpdate('textSpiralY', v)}
            compact
          />
          <SliderControl
            id="watermark-spiral-spacing-range"
            label="Distancia entre Vueltas"
            value={settings.textSpiralTurnSpacing ?? 60}
            displayValue={`${settings.textSpiralTurnSpacing ?? 60}px`}
            min={20}
            max={300}
            onChange={(v) => onUpdate('textSpiralTurnSpacing', v)}
            compact
          />
        </div>
      )}
    </div>
  );
}
