import { Grid3X3 } from 'lucide-react';
import { WatermarkSettings } from '../../types';
import SectionHeading from '../ui/SectionHeading';
import SliderControl from '../ui/SliderControl';

interface SpacingOffsetControlsProps {
  settings: WatermarkSettings;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
}

/** Controles de espaciado y desplazamiento del patrón de mosaico. */
export default function SpacingOffsetControls({ settings, onUpdate }: SpacingOffsetControlsProps) {
  return (
    <div className="space-y-4">
      <SectionHeading icon={Grid3X3}>Espaciado de Mosaico (Tiling)</SectionHeading>

      <SliderControl
        id="watermark-spacing-x-range"
        label="Espaciado Horizontal"
        value={settings.spacingX}
        displayValue={`${settings.spacingX}px`}
        min={10}
        max={500}
        onChange={(v) => onUpdate('spacingX', v)}
      />

      <SliderControl
        id="watermark-spacing-y-range"
        label="Espaciado Vertical"
        value={settings.spacingY}
        displayValue={`${settings.spacingY}px`}
        min={10}
        max={500}
        onChange={(v) => onUpdate('spacingY', v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <SliderControl
          id="watermark-offset-x-range"
          label="Desplazar X"
          value={settings.offsetX}
          displayValue={`${settings.offsetX}px`}
          min={-200}
          max={200}
          onChange={(v) => onUpdate('offsetX', v)}
        />
        <SliderControl
          id="watermark-offset-y-range"
          label="Desplazar Y"
          value={settings.offsetY}
          displayValue={`${settings.offsetY}px`}
          min={-200}
          max={200}
          onChange={(v) => onUpdate('offsetY', v)}
        />
      </div>
    </div>
  );
}
