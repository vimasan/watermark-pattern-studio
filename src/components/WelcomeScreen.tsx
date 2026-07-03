import { ChangeEvent } from 'react';
import { Grid3X3, Upload, Zap, Lock, Layers } from 'lucide-react';

interface WelcomeScreenProps {
  isDark: boolean;
  onImageSelected: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Fidelidad 100%',
    description: 'Soporte y preservación de imágenes en alta resolución 4K y 8K.',
  },
  {
    icon: Lock,
    title: 'Privacidad Total',
    description: 'Los archivos nunca salen de su navegador. Ejecución offline segura.',
  },
  {
    icon: Layers,
    title: 'Modo Masivo',
    description: 'Procesa decenas de imágenes en lotes con marcas idénticas.',
  },
] as const;

/**
 * Pantalla de bienvenida mostrada cuando aún no se ha cargado ninguna imagen.
 */
export default function WelcomeScreen({ isDark, onImageSelected }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-xl text-center bg-white/5 dark:bg-black/20 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg shadow-indigo-500/20">
          <Grid3X3 className="w-8 h-8" />
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Proteja sus imágenes con Mosaicos
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
          Añada marcas de agua continuas de texto o logotipos transparentes repetidas uniformemente por toda la
          superficie. Ideal para fotografías, muestras confidenciales o firmas corporativas.
        </p>

        {/* Upload Zone */}
        <div className="mt-8">
          <label
            htmlFor="landing-file-input"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            Cargar Imagen Inicial
          </label>
          <input
            id="landing-file-input"
            type="file"
            accept="image/*"
            onChange={onImageSelected}
            className="hidden"
          />
          <span className="block text-[10px] opacity-45 mt-2.5 font-mono">Formatos admitidos: JPEG, PNG, WEBP</span>
        </div>

        {/* Quick features benefits */}
        <div className="grid grid-cols-3 gap-4 mt-12 border-t border-white/10 pt-8 text-left">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="space-y-1.5">
              <div className="flex items-center gap-1 text-indigo-400 font-semibold text-xs">
                <Icon className="w-3.5 h-3.5" />
                <span>{title}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
