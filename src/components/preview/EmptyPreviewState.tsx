import { FileImage } from 'lucide-react';

interface EmptyPreviewStateProps {
  isDark: boolean;
}

/** Estado vacío mostrado cuando aún no hay ninguna imagen seleccionada. */
export default function EmptyPreviewState({ isDark }: EmptyPreviewStateProps) {
  return (
    <div className="text-center max-w-md mx-auto p-8 relative z-10 bg-white/5 dark:bg-black/20 border border-white/5 rounded-3xl backdrop-blur-xl shadow-2xl">
      <div
        className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 ${
          isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-zinc-500 shadow-sm'
        }`}
      >
        <FileImage className="w-8 h-8" />
      </div>
      <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
        No se ha seleccionado ninguna imagen
      </h3>
      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
        Sube una imagen individual en el panel superior, o arrastra un lote de imágenes a la pestaña de "Procesador
        por Lotes" para comenzar.
      </p>
    </div>
  );
}
