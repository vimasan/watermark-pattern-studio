import { Layers } from 'lucide-react';
import { WatermarkSettings } from '../../types';
import SectionHeading from '../ui/SectionHeading';

interface MetadataControlsProps {
  isDark: boolean;
  settings: WatermarkSettings;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
}

/** Campos de metadatos EXIF personalizados (autor y copyright) para la exportación. */
export default function MetadataControls({ isDark, settings, onUpdate }: MetadataControlsProps) {
  const inputClassName = `w-full px-3.5 py-2 text-xs rounded-xl border outline-none transition-all duration-300 ${
    isDark
      ? 'bg-white/[0.02] border-white/10 focus:border-indigo-500 text-white'
      : 'bg-zinc-50 border-zinc-200 focus:border-indigo-500 text-slate-800'
  }`;

  return (
    <div className="space-y-4">
      <SectionHeading icon={Layers}>Metadatos EXIF de Exportación</SectionHeading>

      <p className="text-[10px] opacity-60 leading-relaxed">
        Los metadatos se añadirán directamente a la estructura EXIF del archivo JPEG exportado, preservando también
        los datos de cámara originales.
      </p>

      <div className="space-y-1.5">
        <label htmlFor="metadata-author-input" className="text-xs font-semibold opacity-85 block">
          Autor / Creador
        </label>
        <input
          id="metadata-author-input"
          type="text"
          placeholder="Ej. Juan Pérez"
          value={settings.metadataAuthor || ''}
          onChange={(e) => onUpdate('metadataAuthor', e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="metadata-copyright-input" className="text-xs font-semibold opacity-85 block">
          Copyright / Licencia
        </label>
        <input
          id="metadata-copyright-input"
          type="text"
          placeholder="Ej. © 2026 Todos los derechos reservados."
          value={settings.metadataCopyright || ''}
          onChange={(e) => onUpdate('metadataCopyright', e.target.value)}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
