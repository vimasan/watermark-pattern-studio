import { RotateCw } from 'lucide-react';
import { WatermarkSettings } from '../../types';
import SectionHeading from '../ui/SectionHeading';
import SliderControl from '../ui/SliderControl';

interface RotationOpacityControlsProps {
  settings: WatermarkSettings;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
}

/** Controles globales de opacidad y rotación del mosaico. */
export default function RotationOpacityControls({ settings, onUpdate }: RotationOpacityControlsProps) {
  return (
    <div className="space-y-4">
      <SectionHeading icon={RotateCw}>Rotación y Opacidad</SectionHeading>

      <SliderControl
        id="watermark-opacity-range"
        label="Opacidad total"
        value={settings.opacity}
        displayValue={`${Math.round(settings.opacity * 100)}%`}
        min={0.01}
        max={1}
        step={0.01}
        parse="float"
        onChange={(v) => onUpdate('opacity', v)}
      />

      <SliderControl
        id="watermark-rotation-range"
        label="Rotación del mosaico"
        value={settings.rotation}
        displayValue={`${settings.rotation}°`}
        min={-180}
        max={180}
        onChange={(v) => onUpdate('rotation', v)}
      />
    </div>
  );
}
