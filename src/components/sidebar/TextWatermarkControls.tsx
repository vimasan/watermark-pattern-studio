import { Type, Type as FontIcon } from 'lucide-react';
import { WatermarkSettings } from '../../types';
import { FONTS } from '../../constants/fonts';
import SliderControl from '../ui/SliderControl';
import SpiralControls from './SpiralControls';

interface TextWatermarkControlsProps {
  isDark: boolean;
  settings: WatermarkSettings;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
  onSettingsChange: (settings: WatermarkSettings) => void;
}

/** Controles específicos de la marca de agua de tipo texto: contenido, tipografía, color y espiral. */
export default function TextWatermarkControls({
  isDark,
  settings,
  onUpdate,
  onSettingsChange,
}: TextWatermarkControlsProps) {
  // El efecto espiral ignora la rotación manual: al activarlo guardamos la rotación
  // previa para poder restaurarla si el usuario lo desactiva más tarde.
  const toggleSpiral = () => {
    const nextSpiral = !settings.textSpiral;
    if (nextSpiral) {
      onSettingsChange({ ...settings, textSpiral: true, prevRotation: settings.rotation, rotation: 0 });
    } else {
      onSettingsChange({
        ...settings,
        textSpiral: false,
        rotation: settings.prevRotation !== undefined ? settings.prevRotation : settings.rotation,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="watermark-text-input" className="text-xs font-semibold opacity-80 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-400" /> Texto de la Marca
        </label>
        <input
          id="watermark-text-input"
          type="text"
          value={settings.text}
          onChange={(e) => onUpdate('text', e.target.value)}
          placeholder="Introduzca texto..."
          className={`w-full px-3 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            isDark
              ? 'bg-black/30 border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500'
              : 'bg-white border-zinc-200 text-zinc-950 placeholder-zinc-400'
          }`}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="watermark-font-select" className="text-xs font-semibold opacity-80 flex items-center gap-1.5">
          <FontIcon className="w-3.5 h-3.5 text-indigo-400" /> Tipografía
        </label>
        <select
          id="watermark-font-select"
          value={settings.fontFamily}
          onChange={(e) => onUpdate('fontFamily', e.target.value)}
          className={`w-full px-3 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            isDark ? 'bg-[#0d121f] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-950'
          }`}
        >
          {FONTS.map((font) => (
            <option
              key={font.value}
              value={font.value}
              className={isDark ? 'bg-[#0d121f] text-white' : 'bg-white text-zinc-900'}
            >
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <SliderControl
        id="watermark-fontsize-range"
        label="Tamaño de Letra"
        value={settings.fontSize}
        displayValue={`${settings.fontSize}px`}
        min={10}
        max={120}
        onChange={(v) => onUpdate('fontSize', v)}
      />

      <div className="space-y-1.5">
        <span className="text-xs font-semibold opacity-80 block">Color del Texto</span>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 shadow-lg">
            <input
              id="watermark-color-picker"
              type="color"
              value={settings.color}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
            />
          </div>
          <input
            id="watermark-color-text"
            type="text"
            value={settings.color}
            onChange={(e) => onUpdate('color', e.target.value)}
            className={`w-full px-3.5 py-2 text-xs font-mono rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-800'
            }`}
          />
        </div>
      </div>

      <SpiralControls isDark={isDark} settings={settings} onToggleSpiral={toggleSpiral} onUpdate={onUpdate} />
    </div>
  );
}
