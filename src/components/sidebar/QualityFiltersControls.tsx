import { Sliders } from 'lucide-react';
import { WatermarkSettings } from '../../types';
import SectionHeading from '../ui/SectionHeading';
import SliderControl from '../ui/SliderControl';
import ToggleSwitch from '../ui/ToggleSwitch';

interface QualityFiltersControlsProps {
  isDark: boolean;
  settings: WatermarkSettings;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
}

/** Filtro de escala de grises y ajuste de calidad de exportación. */
export default function QualityFiltersControls({ isDark, settings, onUpdate }: QualityFiltersControlsProps) {
  return (
    <div className="space-y-4">
      <SectionHeading icon={Sliders}>Filtros y Calidad de Exportación</SectionHeading>

      <div
        className={`flex items-center justify-between p-3 rounded-xl border ${
          isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200/60 bg-zinc-50'
        }`}
      >
        <div className="flex flex-col gap-0.5 pr-2">
          <span className="text-xs font-semibold">Imagen en Blanco y Negro</span>
          <span className="text-[10px] opacity-60">Convierte la foto original a escala de grises</span>
        </div>
        <ToggleSwitch
          id="watermark-grayscale-toggle"
          checked={settings.grayscale}
          onChange={(v) => onUpdate('grayscale', v)}
        />
      </div>

      <div className="space-y-1.5">
        <SliderControl
          id="watermark-quality-range"
          label="Calidad de Exportación"
          value={settings.exportQuality}
          displayValue={`${Math.round(settings.exportQuality * 100)}%`}
          min={0.1}
          max={1.0}
          step={0.05}
          parse="float"
          onChange={(v) => onUpdate('exportQuality', v)}
        />
        <div className="flex justify-between text-[10px] opacity-40">
          <span>Compreso (10%)</span>
          <span>HD Sin Pérdidas (100%)</span>
        </div>
      </div>
    </div>
  );
}
