import { ChangeEvent, RefObject } from 'react';
import { Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { WatermarkSettings } from '../../types';
import SliderControl from '../ui/SliderControl';

interface ImageWatermarkControlsProps {
  isDark: boolean;
  settings: WatermarkSettings;
  fileInputRef: RefObject<HTMLInputElement>;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onUpdate: <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => void;
}

/** Controles específicos de la marca de agua de tipo imagen/logotipo. */
export default function ImageWatermarkControls({
  isDark,
  settings,
  fileInputRef,
  onUpload,
  onClear,
  onUpdate,
}: ImageWatermarkControlsProps) {
  return (
    <div className="space-y-4">
      <span className="text-xs font-semibold opacity-80 flex items-center gap-1.5">
        <Upload className="w-3.5 h-3.5 text-indigo-400" /> Archivo de Marca (.png, .jpg)
      </span>

      {settings.imageSrc ? (
        <div
          className={`p-3.5 rounded-xl border backdrop-blur-md transition-all ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50/50'
          } flex items-center justify-between`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={settings.imageSrc}
              alt="Watermark preview"
              className="w-12 h-12 object-contain bg-black/20 rounded-lg border border-white/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">Logotipo Cargado</p>
              <p className="text-[10px] opacity-60">Listo para mosaico</p>
            </div>
          </div>
          <button
            id="btn-remove-watermark-img"
            onClick={onClear}
            className="p-2 text-zinc-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Eliminar marca de agua"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition-all hover:bg-white/[0.02] ${
            isDark ? 'border-white/10 bg-black/20' : 'border-zinc-300 bg-zinc-50/30'
          }`}
        >
          <ImageIcon className="w-8 h-8 mx-auto text-indigo-400 mb-2.5" />
          <p className="text-xs font-bold">Haz clic para cargar imagen</p>
          <p className="text-[10px] opacity-50 mt-1">Soporta PNG transparente o JPEG</p>
          <input
            ref={fileInputRef}
            id="watermark-image-file"
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
          />
        </div>
      )}

      <SliderControl
        id="watermark-scale-range"
        label="Escalado de Imagen"
        value={settings.imageScale}
        displayValue={`${Math.round(settings.imageScale * 100)}%`}
        min={0.1}
        max={2}
        step={0.05}
        parse="float"
        disabled={!settings.imageSrc}
        onChange={(v) => onUpdate('imageScale', v)}
      />
    </div>
  );
}
